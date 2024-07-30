'use client'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import PrimaryButton from "./PrimaryButton";
import { AddRounded } from "@mui/icons-material";
import { useState } from "react";

export default function AddForm({ addNewItem, handleClose }) {
    // to-do: pantry categories
    // categories - dairy, produce, meat & poultry, beverages, grains & pasta, canned & jarred goods, baking supplies, spices & seasonings, snacks, frozen foods, condiments & sauces, breads & baked goods, oils & vinegars, legumes & beans, pantry staples, dry goods, pet food, cleaning supplies

    const [ name, setName ] = useState('');
    const [ category, setCategory ] = useState('');
    const [ quantity, setQuantity ] = useState(0);
    const [ expiration, setExpiration ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            name,
            category,
            quantity,
            expiration
        }

        console.log("newItem", newItem)

        addNewItem(newItem);

        // reset form after submission
        setName('');
        setCategory('');
        setQuantity(0);
        setExpiration('');

        handleClose();
    }


  return (
    <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            bgcolor: 'background.paper',
            width: 600,
            transform: 'translate(-50%, -50%)',
            p: 3,
            boxShadow: 24,
        }}
    >
        <Typography
            sx={{
                color: 'primary.main',
                fontWeight: '500',
                paddingBottom: '2rem',
            }}
        >
            Add a new item
        </Typography>
        <Box
            component="form"
            autoComplete="off"
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            onSubmit={handleSubmit}
        >
            <TextField
                id="outlined-required"
                label="Item name"
                placeholder="Ex: Carrot"
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{
                    width: '100%',
                }}
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <FormControl>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    id="outlined-required"
                    labelId="category-label"
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        },
                        getContentAnchorEl: null,
                        PaperProps: {
                            sx: {
                                maxHeight: 200,
                            }
                        }
                    }}
                >
                    {/* dairy, produce, meat & poultry, beverages, grains & pasta, canned & jarred goods, baking supplies, spices & seasonings, snacks, frozen foods, condiments & sauces, breads & baked goods, oils & vinegars, legumes & beans, pantry staples, dry goods, pet food, cleaning supplies */}
                    <MenuItem value="Dairy">Dairy</MenuItem>
                    <MenuItem value="Produce">Produce</MenuItem>
                    <MenuItem value="Meat & Poultry">Meat & Poultry</MenuItem>
                    <MenuItem value="Beverages">Beverages</MenuItem>
                    <MenuItem value="Grains & Pasta">Grains & Pasta</MenuItem>
                    <MenuItem value="Breads & Baked Goods">Breads & Baked Goods</MenuItem>
                    <MenuItem value="Canned & Jarred Goods">Canned & Jarred Goods</MenuItem>
                    <MenuItem value="Spices & Seasonings">Spices & Seasonings</MenuItem>
                    <MenuItem value="Snacks">Snacks</MenuItem>
                    <MenuItem value="Frozen Foods">Frozen Foods</MenuItem>
                    <MenuItem value="Condiments & Sauces">Condiments & Sauces</MenuItem>
                    <MenuItem value="Baking Supplies">Baking Supplies</MenuItem>
                    <MenuItem value="Oils & Vinegars">Oils & Vinegars</MenuItem>
                    <MenuItem value="Legumes & Beans">Legumes & Beans</MenuItem>
                    <MenuItem value="Pantry Staples">Pantry Staples (ex: Honey, Jam)</MenuItem>
                    <MenuItem value="Dry Goods">Dry Goods</MenuItem>
                    <MenuItem value="Pet Food">Pet Food</MenuItem>
                    <MenuItem value="Cleaning Supplies">Cleaning Supplies</MenuItem>
                </Select>
            </FormControl>

            <Box
                display={"flex"}
                gap={2}
            >
                <TextField
                    id="outlined-required"
                    label="Quantity"
                    type="number"
                    placeholder="Ex: 8"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        width: '50%',
                    }}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />

                <TextField
                    id="outlined-required"
                    label="Expiration"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        width: '50%',
                    }}
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                />
            </Box>

            <Box
                alignSelf={"flex-end"}
            >
                <Button
                    type="submit"
                    sx={{
                        borderRadius: '18px',
                        bgcolor: 'primary.main',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        color: 'secondary.main',
                        '&:hover': {
                            bgcolor: 'primary.dark'
                        },
                    }}
                    startIcon={<AddRounded />}
                >
                    Add
                </Button>
            </Box>

        </Box>
    </Box>
  )
}
