const express = require ('express'); 
const mysql = require('mysql2')
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'matakuliah'
});

connection.connect(error => {
    if (error) {
        console.log(error)
    };
    console.log('terhubung ke database matakuliah')
})

app.get('/', (req, res) => {
    const qstring = "SELECT * FROM matakuliah";
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
    // const mahasiswaBaru = req.body;
    const {kodeMk, namaDosen, matkul, kelas} = req.body

    connection.query("INSERT INTO matakuliah values (?,?,?,?) ", [kodeMk, namaDosen, matkul, kelas], (err) => {
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

app.get('/:kodeMk', (req, res) => {
    const qstring = `SELECT * FROM matakuliah WHERE kodeMk = '${req.params.kodeMk}'`;
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

app.put('/:kodeMk', (req,res) => {
    const kodeMk = req.params.kodeMk;
    const Mk = req.body;
    const qstring = `UPDATE matakuliah
                    SET namaDosen = '${Mk.namaDosen}', matkul = '${Mk.matkul}', kelas = '${Mk.kelas}'
                    WHERE kodeMk = '${kodeMk}'`
    connection.query(qstring, (err,data) => {
        if(err) {
            res.status(500).send({
                message: "Error updating matakuliah with kodeMk" + kodeMk
            });
        }
        else if(data.affectedRows ==0){
            res.status(404),send({
                message: `Not found matakuliah with kodeMk ${kodeMk}.`
            });
        }
        else {
            console.log("update matakuliah: ", {kodeMk: kodeMk, ...Mk});
            res.send({kodeMk: kodeMk, ...Mk});
        }
    })
})

app.delete('/:kodeMk', (req,res) => {
    const kodeMk = req.params.kodeMk
    const qstring = `DELETE FROM matakuliah WHERE kodeMk = '${kodeMk}'`
    connection.query(qstring, (err, data) => {
        if(err) {
            res.status(500).send({
                message: "Error deleting matakuliah with kodeMk " + kodeMk
            });
        }
        else if (data.affectedRows == 0){
            res.status(404).send({
                message: `Not found matakuliah with kodeMk ${kodeMk}.`
            });
        }
        else res.send(`matakuliah dengan kodeMk = ${kodeMk} telah terhapus`)
    });
})


app.get('/', (req, res) => {
    res.send('server page')
});

app.listen(port, () => {
    console.log(`Server berjalan pada localhost:${port}`)
});