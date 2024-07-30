'use client'
import { Box, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridDeleteIcon } from '@mui/x-data-grid';
import { firestore } from "@/firebase";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import modal from "./modal";
import AddForm from "@/components/AddForm";

export default function Pantry() {
    const [ pantry, setPantry ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ item, setItem ] = useState({});

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const cols = [
        { field: 'name', headerName: 'Name', width: 300, editable: true },
        { field: 'category', headerName: 'Category', width: 300, editable: true },
        { field: 'quantity', headerName: 'Quantity', width: 150, editable: true },
        { field: 'expiration', headerName: 'Expiration Date', width: 150, editable: true },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <>
                    <GridActionsCellItem
                        icon={<GridDeleteIcon />}
                        onClick={() => handleDelete(params.id)}
                        sx={{
                            color: 'accent.main'
                        }}
                    />
                </>
            )
        }
    ];


    const handleDelete = (id) => {
        setPantry(pantry.filter((row) => row.id !== id));
    };

    const updatePantry = async () => {
        const snapshot = query(collection(firestore, 'pantry'));
        const docs = await getDocs(snapshot);
        const pantryList = [];
        docs.forEach((doc) => {
            pantryList.push({
                ...doc.data(), id: doc.id
            })
        })

        setPantry(pantryList);
    }

    const addItem = async (newItem) => {
        console.log('Added item:', newItem);
        const pantryCollection = collection(firestore, 'pantry');
        const newPantryItem = await addDoc(pantryCollection, newItem);
        setPantry((prevPantry) => [...prevPantry, { ...newItem, id: newPantryItem.id }]);
        
        console.log("new doc==>", newPantryItem.id)
    }

    useEffect(() => {
        updatePantry();
    }, [])

    console.log('pantry ==>', pantry)

  return (
    <Box
        sx={{
            borderRadius: '8px',
            width: '100%',
            height: '90%'
        }}
    >
        {/* to-do: pantry, add item component
            list out each item with item name, quantity, expiration date, category
            add item component - option to scan image to automatically name and categorize the item?
         */}
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
            rows={pantry} columns={cols}
            sx={{
                bgcolor: '#ffffff',
                '.MuiDataGrid-root': {
                    borderRadius: '18px',
                },
                '& .MuiDataGrid-container--top': {
                    borderRadius: '8px',
                    backgroundColor: "#99D9EA"
                },
                '& .MuiDataGrid-cell': {
                    textTransform: 'capitalize',
                }
            }}
        />
    </Box>
  )
}
