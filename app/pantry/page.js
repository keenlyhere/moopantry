'use client'
import { Box, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridDeleteIcon } from '@mui/x-data-grid';
import { firestore } from "@/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Pantry() {
    const rows = [
        { id: 1, name: 'Carrot', category: 'Produce', quantity: 3, expiration: '8/12/24' },
        { id: 2, name: 'Milk', category: 'Dairy', quantity: 1, expiration: '8/9/24' },
        { id: 3, name: 'Eggs', category: 'Dairy', quantity: 12, expiration: '8/15/24' },
    ];

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
                    />
                </>
            )
        }
    ];

    const [ pantry, setPantry ] = useState([]);

    const handleDelete = (id) => {
        setPantry(pantry.filter((row) => row.id !== id));
    };

    useEffect(() => {
        const updatePantry = async () => {
            const snapshot = query(collection(firestore, 'pantry'));
            const docs = await getDocs(snapshot);
            const pantryList = [];
            docs.forEach((doc) => {
                pantryList.push({
                    ...doc.data(), name: doc.id
                })
            })

            setPantry(pantryList);
        }

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
        <Typography
            sx={{
                paddingBottom: '1rem',
                color: 'primary.dark'
            }}
        >
            My Pantry
        </Typography>
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
                }
            }}
        />
    </Box>
  )
}
