'use client'
import { firestore } from "@/firebase";
import { collection, query, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddForm from "@/components/AddForm";
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { Modal, Typography } from "@mui/material";
import PrimaryButton from "@/components/PrimaryButton";
import { DeleteRounded } from "@mui/icons-material";

export default function Pantry() {
    const [ pantry, setPantry ] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [ open, setOpen ] = useState(false);

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
            setPantry(pantry.filter((row) => row.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = pantry.find((row) => row.id === id);
        if (editedRow.isNew) {
            setPantry(pantry.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        try {
            const pantryDoc = doc(firestore, 'pantry', newRow.id);
            await updateDoc(pantryDoc, {
                name: newRow.name,
                category: newRow.category,
                quantity: newRow.quantity,
                expiration: newRow.expiration,
            });
            setPantry(pantry.map((row) => (row.id === newRow.id ? updatedRow : row)));
        } catch (error) {
            console.error('Error updating item:', error);
        }
        return updatedRow;
    };

    const addItem = async (newItem) => {
        try {
            const pantryCollection = collection(firestore, 'pantry');
            const newPantryItem = await addDoc(pantryCollection, newItem);
            setPantry((prevPantry) => [...prevPantry, { ...newItem, id: newPantryItem.id }]);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const updatePantry = async () => {
        const snapshot = query(collection(firestore, 'pantry'));
        const docs = await getDocs(snapshot);
        const pantryList = [];
        docs.forEach((doc) => {
            pantryList.push({
                ...doc.data(),
                id: doc.id
            })
        })

        setPantry(pantryList);
    }

  const columns = [
    { field: 'name', headerName: 'Name', width: 200, editable: true },
    {
      field: 'category',
      headerName: 'Category',
      width: 200,
      align: 'left',
      headerAlign: 'left',
      type: 'singleSelect',
      editable: true,
      valueOptions: ['Dairy', 'Produce', 'Meat & Poultry', 'Beverages', 'Grains & Pasta', 'Breads & Baked Goods', 'Canned & Jarred Goods', 'Spice & Seasonings', 'Snacks', 'Frozen Foods', 'Condiments & Sauces', 'Baking Supplies', 'Oils & Vinegars', 'Legumes & Beans', 'Pantry Staples', 'Dry Goods', 'Pet Food', 'Cleaning Supplies'],
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      width: 100,
      editable: true,
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'expiration',
      headerName: 'Expiration',
      type: 'date',
      width: 100,
      editable: true,
      valueGetter: (params) => {
            return params.seconds ? new Date(params.seconds * 1000) : new Date(params);
        }
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
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            sx={{
                color: 'primary.dark'
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteRounded />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            sx={{
                color: 'accent.main'
            }}
          />,
        ];
      },
    },
  ];

    useEffect(() => {
        updatePantry();
    }, [])

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
        <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{
                paddingBottom: '1rem',
            }}
        >
            <Typography
                sx={{
                    color: 'primary.dark'
                }}
            >
                My Pantry
            </Typography>
            <PrimaryButton buttonText='Add Item' onClick={handleOpen} />
        </Box>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="Add new pantry item form"
            aria-describedby="Form to add a new item to your pantry"
            sx={{
                p: 3,
            }}
        >
            <AddForm addNewItem={addItem} handleClose={handleClose} />
        </Modal>
        <DataGrid
            rows={pantry}
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
            }}
        />
    </Box>
  );
}
