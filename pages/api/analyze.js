import axios from 'axios';
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: `${process.env.NEXT_PUBLIC_OPEN_API_KEY}`
})

const prompt = `
    Analyze the given image and perform the following tasks:

    1. Identify all visible items in the image.
    2. Determine the category each item falls under. The categories are:
        Dairy
        Produce
        Meat & Poultry
        Beverages
        Grain & Pasta
        Breads & Baked Goods
        Canned & Jarred Goods
        Spices & Seasonings
        Snacks
        Frozen Foods
        Condiments & Sauces
        Baking Supplies
        Oils & Vinegars
        Legumes & Beans
        Pantry Staples
        Dry Goods
        Pet Food
        Cleaning Supplies
    3. If an expiration date or best by date is visible on any item, identify and include the expiration date.
    4. If no expiration date or best by date is found for an item, set the expiration field to an empty string.
    5. If there is more than one of the same item in the image, count the quantity of that item.
    6. Return the results in a structured JSON format with plain text, no markdown, and no extra characters. Below is an example of the formatted JSON result:
        {
            "items": [
                {
                    "name": "Carrot",
                    "category": "Produce",
                    "quantity": 3,
                    "expiration": "2023-08-30"
                },
                {
                    "name": "Milk",
                    "category": "Dairy",
                    "quantity": 1,
                    "expiration": "2023-09-15"
                }
            ]
        }

`

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method === 'POST') {
        const { image } = req.body;
        // console.log('image:', image);

        // try {
        //     const response = await axios.post('https://api.openai.com/v1/vision/analyze', {
        //         image,
        //     }, {
        //         headers: {
        //             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        //             'Content-Type': 'application/json'
        //         }
        //     });

        //     res.status(200).json(response.data);
        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ message: 'An error occurred' });
        // }

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `${image}`,
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 300,
            })

            console.log('response:\n\n\n', response.choices[0].message.content.items);
            return res.json(response.choices[0].message.content);
        } catch (error) {
            console.log('image:', image)
            console.error('Error analyzing image:', error);
            res.status(500).json({ message: 'Error analyzing image' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }

    return (
        <div>analyze</div>
    )
}
