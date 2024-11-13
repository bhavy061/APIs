const Car = require('../models/car');
const multer = require('multer');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

exports.createCar = async (req, res) => {
    const { title, description, tags } = req.body;
    const images = req.files.map(file => file.path);
    try {
        const car = new Car({
            userId: req.user.id,
            title,
            description,
            tags,
            images
        });
        await car.save();
        res.status(201).json(car);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find({ userId: req.user.id });
        res.json(cars);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (car.userId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const updates = { title, description, tags };
        if (req.files) updates.images = req.files.map(file => file.path);

        const car = await Car.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (car.userId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
        res.json(car);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (car.userId.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: "Car deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
