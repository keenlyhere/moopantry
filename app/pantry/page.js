'use client'
import { firestore } from "@/firebase";
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc, where, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddForm from "@/components/AddForm";
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Button, Modal, TextField, Typography, useMediaQuery } from "@mui/material";
import { AddRounded, DeleteRounded, EditRounded } from "@mui/icons-material";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";

export default function Pantry() {
    const { data: session } = useSession();
    const [ pantryItems, setPantryItems ] = useState([]);
    const [ rowModesModel, setRowModesModel ] = useState({});
    const [ open, setOpen ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState('');
    const isMobile = useMediaQuery('(max-width:600px)');
    const [ pantryId, setPantryId ] = useState(null);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
        try {
            await deleteDoc(doc(firestore, 'pantry', id));
            setPantryItems(pantryItems.filter((row) => row.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = pantryItems.find((row) => row.id === id);
        if (editedRow.isNew) {
            setPantryItems(pantryItems.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        try {
            const pantryItemDoc = doc(firestore, 'PantryItems', newRow.id);
            const expirationTimestamp = newRow.expiration instanceof Date ? Timestamp.fromDate(newRow.expiration) : newRow.expiration;

            await updateDoc(pantryItemDoc, {
                name: newRow.name,
                category: newRow.category,
                quantity: newRow.quantity,
                expiration: expirationTimestamp,
            });
            setPantryItems(pantryItems.map((row) => (row.id === newRow.id ? { ...updatedRow, expiration: expirationTimestamp } : row)));
        } catch (error) {
            console.error('Error updating item:', error);
        }
        return updatedRow;
    };

    const handleDateChange = (date) => {
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        setExpiration(utcDate);
    };

    const addItem = async (newItem) => {
        try {
            const pantryItemsColleciton = collection(firestore, 'PantryItems');

            // convert date string to timestamp
            const parsedDate = new Date(newItem.expiration);
            const expirationTimestamp = Timestamp.fromDate(parsedDate);

            // check if item with same name and expiration exists
            const existingItemQuery = query(pantryItemsColleciton, where('pantryId', '==', pantryId), where('name', '==', newItem.name), where('expiration', '==', expirationTimestamp));
            const querySnapshot = await getDocs(existingItemQuery);

            if (!querySnapshot.empty) {
                // update quantity
                const existingItemDoc = querySnapshot.docs[0];
                const existingItemData = existingItemDoc.data();
                const updatedQuantity = Number(existingItemData.quantity) + Number(newItem.quantity);

                await updateDoc(existingItemDoc.ref, {
                    quantity: updatedQuantity
                });

                // update state
                setPantryItems((prevPantryItem) => (
                    prevPantryItem.map((item) => (
                        item.id === existingItemDoc.id ? { ...item, quantity: updatedQuantity } : item
                    ))
                ));
            } else {
                // add new item
                const newPantryItem = await addDoc(pantryItemsColleciton, { ...newItem, expiration: expirationTimestamp, pantryId });
                setPantryItems((prevPantry) => [...prevPantry, { ...newItem, expiration: expirationTimestamp, id: newPantryItem.id }]);
            }
        } catch (error) {
            console.error("Error adding item:", error);
        }
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const updatePantryItems = async (pantryId) => {
        const snapshot = query(collection(firestore, 'PantryItems'), where('pantryId', '==', pantryId));
        const docs = await getDocs(snapshot);
        const pantryItemsList = [];
        docs.forEach((doc) => {
            pantryItemsList.push({
                ...doc.data(),
                id: doc.id
            })
        })

        setPantryItems(pantryItemsList);
    }

    const getPantryId = async (userId) => {
        const pantriesQuery = query(collection(firestore, 'Pantry'), where ('userId', '==', userId));
        const docs = await getDocs(pantriesQuery);

        if (!docs.empty) {
            return docs.docs[0].id;
        } else {
            // create a pantry for new user
            const pantryCollection = collection(firestore, 'Pantry');
            const newPantryDoc = await addDoc(pantryCollection, {
                userId: userId,
                createdAt: new Date(),
            });
            return newPantryDoc.id;
        }
    }

    useEffect(() => {
        if (session) {
            getPantryId(session.user.id).then((id) => {
                setPantryId(id);
                updatePantryItems(id);
            })
        }
    }, [session]);

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            editable: true,
            flex: 2,
        },
        {
            field: 'category',
            headerName: 'Category',
            minWidth: 200,
            align: 'left',
            headerAlign: 'left',
            type: 'singleSelect',
            editable: true,
            valueOptions: ['Dairy', 'Produce', 'Meat & Poultry', 'Beverages', 'Grains & Pasta', 'Breads & Baked Goods', 'Canned & Jarred Goods', 'Spice & Seasonings', 'Snacks', 'Frozen Foods', 'Condiments & Sauces', 'Baking Supplies', 'Oils & Vinegars', 'Legumes & Beans', 'Pantry Staples', 'Dry Goods', 'Pet Food', 'Cleaning Supplies'],
            flex: 2,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            minWidth: 100,
            editable: true,
            align: 'left',
            headerAlign: 'left',
            flex: 1,
        },
        {
            field: 'expiration',
            headerName: 'Expiration',
            type: 'date',
            minWidth: 100,
            editable: true,
            valueGetter: (params) => {
                const date = params instanceof Timestamp ? params.toDate() : new Date(params);
                return date;
            },
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                return [
                    <GridActionsCellItem
                        icon={<SaveIcon />}
                        label="Save"
                        sx={{
                            color: 'primary.main',
                        }}
                        onClick={handleSaveClick(id)}
                        key={`save_${id}`}
                    />,
                    <GridActionsCellItem
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCancelClick(id)}
                        sx={{
                            color: 'primary.main',
                        }}
                        key={`cancel_${id}`}
                    />,
                ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditRounded
                            sx={{
                                color: 'primary.dark'
                            }}
                        />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        key={`edit_${id}`}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        sx={{
                            color: 'accent.main'
                        }}
                        key={`delete_${id}`}
                    />,
                ];
            },
        },
    ];

    const filteredPantry = pantryItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Box
        sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: 'secondary.main',
        }}
        display={'flex'}
        flexDirection={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row'}}
    >
        <Sidebar />
        <Box
            sx={{
                height: { xs: '100%', sm: '100%'},
                width: '100%',
                '& .actions': {
                color: 'text.secondary',
                },
                '& .textPrimary': {
                color: 'text.primary',
                },
                overflow: 'auto',
                p: '1.5rem 3rem',
            }}
            flex={1}
            display="flex"
            flexDirection="column"
        >
            <Box
                display={'flex'}
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent={'space-between'}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                sx={{
                    paddingBottom: '1.5rem',
                    paddingTop: { xs: 1, sm: 1 },
                }}
                gap={{ xs: 3, sm: 8 }}
            >
                <Typography
                    sx={{
                        color: 'primary.dark'
                    }}
                >
                    Pantry
                </Typography>

                <Box
                    display={'flex'}
                    justifyContent={'flex-end'}
                    sx={{
                        flexGrow: 1,
                        width: { xs: '100%' },
                    }}
                    gap={3}
                >
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                                p: 0,
                                '& fieldset': {
                                    bgcolor: '#ffffff',
                                    borderRadius: '180px',
                                    borderColor: 'primary.main',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                        size='small'
                        placeholder="Search pantry"
                    />

                        { isMobile ? (
                            <Button
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'secondary.main',
                                    borderRadius: '28px',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    }
                                }}
                                startIcon={<AddRounded />}
                                onClick={handleOpen}
                            >
                                Add
                            </Button>
                        ) : (
                            <Button
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'secondary.main',
                                    borderRadius: '28px',
                                    paddingLeft: '1.5rem',
                                    paddingRight: '1.5rem',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    }
                                }}
                                startIcon={<AddRounded />}
                                onClick={handleOpen}
                            >
                                Add Item
                            </Button>
                        )}

                </Box>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="Add new pantry item form"
                aria-describedby="Form to add a new item to your pantry"
                sx={{
                    p: 3,
                    overflow: 'auto',
                }}
            >
                <AddForm addNewItem={addItem} handleClose={handleClose} />
            </Modal>
            <DataGrid
                rows={filteredPantry}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                sx={{
                    '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle': {
                        textTransform: 'capitalize',
                    },
                    '& .MuiDataGrid-container--top [role=row]': {
                        // background: 'none !important',
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                    },
                    bgcolor: '#ffffff',
                    borderRadius: '18px',
                    borderTop: 0,
                    width: '100%',
                    flexGrow: 1,
                    overflowX: 'scroll',
                }}
                flex={1}
            />
        </Box>
    </Box>
  );
}
