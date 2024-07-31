import axios from 'axios';

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

        try {
            const response = await axios.post('https://api.openai.com/v1/vision/analyze', {
                image,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }

    return (
        <div>analyze</div>
    )
}
