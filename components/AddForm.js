'use client'
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { AddRounded, CameraAltRounded } from "@mui/icons-material";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import CameraComponent from "./Camera";

const AddForm = forwardRef(function AddForm({ addNewItem, handleClose }, ref) {
    const [ name, setName ] = useState('');
    const [ category, setCategory ] = useState('');
    const [ quantity, setQuantity ] = useState(1);
    const [ expiration, setExpiration ] = useState('');
    const [ errors, setErrors ] = useState({});
    const [ isFormValid, setIsFormValid ] = useState(false);
    const [ openCamera, setOpenCamera ] = useState(false);
    const camera = useRef(null);
    const mobileScreen = useMediaQuery('(min-width:600px)');
    const [ ratio, setRatio ] = useState(9 / 16);

    useEffect(() => {
        if (mobileScreen) {
            setRatio(3 / 4);
        } else {
            setRatio("cover");
        }
    }, [mobileScreen, ratio])

    const validate = () => {
        const newErrors = {};

        if (!name) {
            newErrors.name = 'Item name is required';
        } else if (name.length < 3) {
            newErrors.name = 'Item name should be at least 3 characters';
        }

        if (!category) {
            newErrors.category = 'Category is required';
        }

        if (!quantity || quantity < 1) {
            newErrors.quantity = 'Quantity should be greater than 0';
        }

        if (!expiration) {
            newErrors.expiration = 'Expiration date is required';
        } else if (new Date(expiration) <= new Date()) {
            newErrors.expiration = 'Expiration date should be in the future';
        }

        setErrors(newErrors);
        console.log("newErrors:", newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const newItem = {
            name,
            category,
            quantity,
            expiration
        }

        console.log("newItem:", newItem)

        await addNewItem(newItem);

        // reset form after submission
        setName('');
        setCategory('');
        setQuantity(0);
        setExpiration('');

        handleClose();
    }

    const handleExpirationChange = (e) => {
        setExpiration(e.target.value);
        const dateError = new Date(e.target.value) <= new Date() ? 'Expiration date should be in the future' : '';
        setErrors((prevErrors) => ({
            ...prevErrors,
            expiration: dateError
        }));
        setIsFormValid(false);
    };

    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleCapture = async () => {
        const image = camera.current.takePhoto();
        console.log("Captured image:", image);

        // to-do: classify image - api call to gpt vision api
        const classifyImage = async (image) => {
            return {
                name: "Carrot",
                category: "Produce",
                quantity: 2,
                expiration: "2024-12-31"
            }
        }

        const classifiedData = await classifyImage(image);

        setName(classifiedData.name);
        setCategory(classifiedData.category);
        setQuantity(classifiedData.quantity);
        setExpiration(classifiedData.expiration);

        setOpenCamera(false);
        setIsFormValid(true);
    }

  return (
    <Box
        ref={ref}
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
        tabIndex={-1}
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
                    input: {
                        color: 'primary.dark'
                    }
                }}
                value={name}
                onChange={e => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
            />

            <FormControl
                error={!!errors.category}
            >
                <InputLabel id="category-label" shrink required>Category</InputLabel>
                <Select
                    id="outlined-required"
                    labelId="category-label"
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <Typography sx={{ color: '#a0a0a0', fontWeight: '400'}}>Select a category</Typography>;
                        }
                        return selected;
                    }}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        },
                        getcontentanchorel: null,
                        PaperProps: {
                            sx: {
                                maxHeight: 200,
                            }
                        }
                    }}
                    sx={{
                        color: 'primary.dark',
                    }}
                    required
                >
                    <MenuItem disabled value="">Select a category</MenuItem>
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
                {errors.category && <FormHelperText color="error">{errors.category}</FormHelperText>}
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
                        input: {
                            color: 'primary.dark'
                        },
                    }}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                    required
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
                        input: {
                            color: 'primary.dark'
                        },
                    }}
                    value={expiration}
                    onChange={handleExpirationChange}
                    error={!!errors.expiration}
                    helperText={errors.expiration}
                    inputProps={{
                        min: getTodayDate(),
                    }}
                    required
                />
            </Box>

            <Box
                alignSelf={"flex-end"}
                display="flex"
                gap={3}
            >
                <Button
                    sx={{
                        borderRadius: '18px',
                        bgcolor: '#ffffff',
                        p: '0 1.5rem',
                        border: '1px solid',
                        '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'secondary.main',
                        }
                    }}
                    startIcon={<CameraAltRounded />}
                    onClick={() => setOpenCamera(true)}
                >
                    Scan item
                </Button>
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
                        '&.Mui-disabled': {
                            bgcolor: 'secondary.main',
                            pointerEvents: 'initial',
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                        },
                    }}
                    startIcon={<AddRounded />}
                    disabled={!isFormValid}
                >
                    Add
                </Button>
            </Box>
        </Box>

        <Modal
            open={openCamera}
            onClose={() => setOpenCamera(false)}
            aria-labelledby="camera-modal-title"
            aria-describedby="camera-modal-description"
        >
            <CameraComponent setOpenCamera={setOpenCamera} camera={camera} ratio={ratio} handleCapture={handleCapture} />
        </Modal>
    </Box>
  )
});

export default AddForm;
