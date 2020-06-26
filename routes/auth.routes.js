const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const User = require('../models/User');
const router = Router();

// /api/auth
router. post(
    '/register',
    [
        check('email', 'Некоректный email').isEmail(),
        check('password', 'Минимальная длинна password 6 символов').isLength( {min: 6})
    ],
    async (req, res) => {
    try {
         console.log(req.body);
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'некоректные данный при регистрации'
            })
        }

        const { email, password } = req.body

        const candidate = await User.findOne({ email });
        if(candidate) {
            return res.status(400).json({ message: 'Такой пользователь уже существует'})
        }

        const hashPasssword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashPasssword });

        await user.save();

        res.status(201).json({ message: 'Пользователь создан'});

    }catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."});
    }
})
router. post(
    '/login',
    [
        check('email', 'Некоректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'некоректные данный при входе'
            })
        }

        const { email, password } = req.body

        const user = await User.findOne({ email })
        if(!user) {
            return res.status(400).json({ message: "Пользователь не найден"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "Неправильный пароль"})
        }

        const token = jwt.sign(
            {userID: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        
        res.json({ token, userID: user.id })
            
    }catch (e) {
        res.status(500).json({message: "Что-то пошло не так..."});
    }
})

module.exports = router;