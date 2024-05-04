const express = require ('express'); 
const mysql = require('mysql2')
const app = express();
const port = 2000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'perpustakaan'
});

connection.connect(error => {
    if (error) {
        console.log(error)
    };
    console.log('terhubung ke database perpustakaan')
})

app.get('/', (req, res) => {
    const qstring = "SELECT * FROM perpustakaan";
    connection.query(qstring, (err,data) => {
        if (err) {
            console.log("error:", err);
            res.status(500).send({
                message : err.message || "Terjadi kesalahan saat get data"
            });
        }
        else res.send(data)
    })
});


app.post('/', (req,res) => {
    const {kodeBuku, judul, tahunTerbit, pengarang} = req.body

    connection.query("INSERT INTO perpustakaan values (?,?,?,?) ", [kodeBuku, judul, tahunTerbit, pengarang], (err) => {
        if (err) {
            console.log("error :", err);
            res.status(500).send({
                message : err.message || "Terjadi kesalahan saat insert data"
            });
        }
        else
            res.send(req.body)
    })
});

app.get('/:kodeBuku', (req, res) => {
    const qstring = `SELECT * FROM perpustakaan WHERE kodeBuku = '${req.params.kodeBuku}'`;
    connection.query(qstring, (err,data) => {
        if (err) {
            console.log("error:", err);
            res.status(500).send({
                message : err.message || "Terjadi kesalahan saat get data"
            });
        }
        else res.send(data)
    })
});

app.put('/:kodeBuku', (req,res) => {
    const kodeBuku = req.params.kodeBuku;
    const Perpus = req.body;
    const qstring = `UPDATE perpustakaan
                    SET judul = '${Perpus.judul}', tahunTerbit = '${Perpus.tahunTerbit}', pengarang = '${Perpus.pengarang}'
                    WHERE kodeBuku = '${kodeBuku}'`
    connection.query(qstring, (err,data) => {
        if(err) {
            res.status(500).send({
                message: "Error updating perpustakaan with kodeBuku" + kodeBuku
            });
        }
        else if(data.affectedRows ==0){
            res.status(404),send({
                message: `Not found perpustakaan with kodeBuku ${kodeBuku}.`
            });
        }
        else {
            console.log("update perpustakaan: ", {kodeBuku: kodeBuku, ...Perpus});
            res.send({kodeBuku: kodeBuku, ...Perpus});
        }
    })
})

app.delete('/:kodeBuku', (req,res) => {
    const kodeBuku = req.params.kodeBuku
    const qstring = `DELETE FROM perpustakaan WHERE kodeBuku = '${kodeBuku}'`
    connection.query(qstring, (err, data) => {
        if(err) {
            res.status(500).send({
                message: "Error deleting perpustakaan with kodeBuku " + kodeBuku
            });
        }
        else if (data.affectedRows == 0){
            res.status(404).send({
                message: `Not found perpustakaan with kodeBuku ${kodeBuku}.`
            });
        }
        else res.send(`perpustakaan dengan kodeBuku = ${kodeBuku} telah terhapus`)
    });
})


app.get('/', (req, res) => {
    res.send('server page')
});

app.listen(port, () => {
    console.log(`Server berjalan pada localhost:${port}`)
});