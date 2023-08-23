const express = require('express');
const mysql = require('mysql2');
const ejs = require('ejs');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const util = require('util');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
app.use('/img', express.static('img'))
app.set('view engine', 'ejs');

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateSecretKey();

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pmp078917',
    database: 'sorteio',
    port: '3306'
});

db.connect((error) => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados');
    }
});

app.get('/', (req, res) => {
    res.render('form')
})

app.post('/enviar-lead', (req, res) => {
    const { formData } = req.body;
    const sqlQtdLeads = `SELECT COUNT(*) AS total FROM rodadas`;
    const sqlVerificaExistencia = `SELECT COUNT(*) AS total FROM rodadas WHERE telefone = ? OR email = ?`;
    db.query(sqlVerificaExistencia, [formData.telefone, formData.email], (error, results) => {
        if (error) {
            console.error('Erro na consulta ao banco de dados', error);
            res.status(500).json({ message: 'Erro ao verificar a existência dos dados' });
            return;
        }

        const existeTelefoneOuEmail = results[0].total > 0;
        if (existeTelefoneOuEmail) {
            res.status(400).json({ message: 'Telefone ou email já cadastrados' });
            return;
        }
        db.query(sqlQtdLeads, (error, results) => {
            if (error) {
                console.error('Erro na consulta ao banco de dados', error);
                res.status(500).json({ message: 'Erro ao enviar os dados' });
                return;
            }
            const qtdLeads = results[0].total;
            const numeroDaSorte = `20230829${qtdLeads}`;
            const sqlEnviaLead = `INSERT INTO rodadas (nome, email, telefone, possuiplano, cidade, numerodasorte) VALUES (?, ?, ?, ?, ?, ?) `;
            db.query(sqlEnviaLead, [formData.nome, formData.email, formData.telefone, formData.possuiplano, formData.cidade, numeroDaSorte], (error, result) => {
                if (error) {
                    console.error("Ocorreu um erro:", error);
                    res.status(500).json({ message: 'Erro ao enviar os dados' });
                    return;
                }
                console.log('Lead cadastrado com sucesso', result);
                res.status(200).json({ message: 'Enviado com sucesso', numeroDaSorte });
            });
        });
    });
});

app.get('/roleta', (req, res) => {
    const sqlQuery = `SELECT COUNT(*) AS total FROM rodadas`;
    
    db.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Erro na consulta ao banco de dados:', error);
            res.render('index', { qtdleads: 0 }); // Renderizar com valor padrão em caso de erro
            return;
        }
        
        const totalRodadas = results[0].total;
        let valorEnviado;

        if (totalRodadas % 20 === 0) {
            valorEnviado = [0, 2, 5, 7][Math.floor(Math.random() * 4)];
        } else {
            valorEnviado = [1, 3, 4, 6, 8][Math.floor(Math.random() * 5)];
        }

        const numeroDaSorte = req.query.numeroDaSorte
        
        res.render('index', { qtdleads: totalRodadas, valorEnviado, numeroDaSorte });
    });
});


app.listen(8888, () => {
    console.log('Aplicação rodando na porta 8888');
});
