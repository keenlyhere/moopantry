'use client'
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { AddRounded, CameraAltRounded } from "@mui/icons-material";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import CameraComponent from "./Camera";

const AddForm = forwardRef(function AddForm({ addNewItem, handleClose }, ref) {
    const [ items, setItems ] = useState([{ name: '', category: '', quantity: 1, expiration: '' }]);
    const [ name, setName ] = useState('');
    const [ category, setCategory ] = useState('');
    const [ quantity, setQuantity ] = useState(1);
    const [ expiration, setExpiration ] = useState('');
    const [ errors, setErrors ] = useState([{}]);
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

    useEffect(() => {
        console.log("**************** ITEMS UPDATED ****************\n\n", items, "\n**************************************");
    }, [items]);

    const validate = () => {
        const newErrors = items.map((item) => {
            const itemErrors = {};

            if (!item.name) {
                itemErrors.name = 'Item name is required';
            } else if (item.name.length < 3) {
                itemErrors.name = 'Item name should be at least 3 characters';
            }

            if (!item.category) {
                itemErrors.category = 'Category is required';
            }

            if (!item.quantity || item.quantity < 1) {
                itemErrors.quantity = 'Quantity should be greater than 0';
            }

            if (!item.expiration) {
                itemErrors.expiration = 'Expiration date is required';
            } else if (new Date(expiration) <= new Date()) {
                itemErrors.expiration = 'Expiration date should be in the future';
            }

            // if (Object.keys(itemErrors).length > 0) {
            //     newErrors[i] = itemErrors;
            // }

            return itemErrors
        })

        setErrors(newErrors);
        console.log("newErrors:", newErrors);

        return newErrors.every(error => Object.keys(error).length === 0);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        for (const item of items) {
            await addNewItem(item);
        }

        // const newItem = {
        //     name,
        //     category,
        //     quantity,
        //     expiration
        // }

        // console.log("newItem:", newItem)

        // await addNewItem(newItem);

        // reset form after submission
        // setName('');
        // setCategory('');
        // setQuantity(0);
        // setExpiration('');
        setItems([{ name: '', category: '', quantity: 1, expiration: '' }]);

        handleClose();
    }

    const handleItemChange = (i, field, value) => {
        const newItems = [...items];
        newItems[i][field] = value;
        setItems(newItems);
        setIsFormValid(validate());
   };

    const handleExpirationChange = (i, value) => {
        const newItems = [...items];
        newItems[i].expiration = value;
        // setExpiration(e.target.value);

        const dateError = new Date(value) <= new Date() ? 'Expiration date should be in the future' : '';
        // setErrors((prevErrors) => ({
        //     ...prevErrors,
        //     [i]: {
        //         ...prevErrors[i],
        //         expiration: dateError
        //     }
        // }));

        setErrors((prevErrors) => {
           const newErrors = [...prevErrors];
           if (!newErrors[i]) newErrors[i] = {};
           newErrors[i].expiration = dateError;
           return newErrors;
       });

        setItems(newItems);
        setIsFormValid(validate());
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
        // console.log("Captured image:", image);

        // to-do: classify image - api call to gpt vision api
        // const classifyImage = async (image) => {
        //     return {
        //         name: "Carrot",
        //         category: "Produce",
        //         quantity: 2,
        //         expiration: "2024-12-31"
        //     }
        // }
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image })
            });

            let data = await res.json();

            if (typeof data === 'string') {
                data = JSON.parse(data);
            }

            console.log("**************** DATA ****************\n\n", data.items, '\n', typeof data, '\n', "**************************************");

            if (data.items && data.items.length > 0) {
                setItems(data.items);
            }
            // setName(data.name);
            // setCategory(data.category);
            // setQuantity(data.quantity);
            // setExpiration(data.expiration);

            setOpenCamera(false);
            // setIsFormValid(validate());
        } catch (error) {
            console.error('Error analyzing image:', error)
        }
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
            justifyContent={'space-between'}
            flex={1}
        >
            { items.map((item, i) => (
                <Box
                    key={`item_${i}`}
                    display='flex'
                    flexDirection='column'
                    gap={3}
                    flex={1}
                >
                    <TextField
                        id={`outlined-required-name-${i}`}
                        label={`Item name ${i + 1}`}
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
                        value={item.name}
                        onChange={e => handleItemChange(i, 'name', e.target.value)}
                        error={!!errors[i]?.name}
                        helperText={errors[i]?.name}
                        required
                    />

                    <FormControl
                        error={!!errors[i]?.category}
                    >
                        <InputLabel id={`category-label-${i}`} shrink required>Category</InputLabel>
                        <Select
                            id={`outlined-required-category-${i}`}
                            labelId={`category-label-${i}`}
                            label="Category"
                            value={item.category}
                            onChange={(e) => handleItemChange(i, 'category', e.target.value)}
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
                        {errors[i]?.category && <FormHelperText color="error">{errors[i]?.category}</FormHelperText>}
                    </FormControl>

                    <Box
                        display={"flex"}
                        gap={2}
                    >
                        <TextField
                            id={`outlined-required-quantity-${i}`}
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
                            value={item.quantity}
                            onChange={(e) => handleItemChange(i, 'quantity', e.target.value)}
                            error={!!errors[i]?.quantity}
                            helperText={errors[i]?.quantity}
                            required
                        />

                        <TextField
                            id={`outlined-required-expiration-${i}`}
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
                            value={items.expiration}
                            onChange={(e) => handleExpirationChange(i, e.target.value)}
                            error={!!errors[i]?.expiration}
                            helperText={errors[i]?.expiration}
                            inputProps={{
                                min: getTodayDate(),
                            }}
                            required
                        />
                    </Box>
                    { i < items.length - 1 && <hr style={{ margin: '2rem 0' }} />}
                </Box>
            ))}

            <Box
                justifySelf='flex-end'
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
