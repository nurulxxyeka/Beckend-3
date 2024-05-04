const express = require ('express'); 
const mysql = require('mysql2')
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mahasiswa'
});

connection.connect(error => {
    if (error) {
        console.log(error)
    };
    console.log('terhubung ke database kuliah-dev')
})

app.get('/', (req, res) => {
    const qstring = "SELECT * FROM mahasiswa";
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
    const {nim,nama,angkatan,prodi} = req.body

    connection.query("INSERT INTO mahasiswa values (?,?,?,?) ", [nim,nama,angkatan,prodi], (err) => {
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

app.get('/:nim', (req, res) => {
    const qstring = `SELECT * FROM mahasiswa WHERE nim = '${req.params.nim}'`;
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

app.put('/:nim', (req,res) => {
    const nim = req.params.nim;
    const mhs = req.body;
    const qstring = `UPDATE mahasiswa 
                    SET nama = '${mhs.nama}', angkatan = '${mhs.angkatan}', prodi = '${mhs.prodi}'
                    WHERE nim = '${nim}'`
    connection.query(qstring, (err,data) => {
        if(err) {
            res.status(500).send({
                message: "Error updating mahasiswa with NIM" + nim
            });
        }
        else if(data.affectedRows ==0){
            res.status(404),send({
                message: `Not found mahasiswa with NIM ${nim}.`
            });
        }
        else {
            console.log("update mahasiswa: ", {nim: nim, ...mhs});
            res.send({nim: nim, ...mhs});
        }
    })
})

app.delete('/:nim', (req,res) => {
    const nim = req.params.nim
    const qstring = `DELETE FROM mahasiswa WHERE nim = '${nim}'`
    connection.query(qstring, (err, data) => {
        if(err) {
            res.status(500).send({
                message: "Error deleting mahasiswa with NIM " + nim
            });
        }
        else if (data.affectedRows == 0){
            res.status(404).send({
                message: `Not found mahasiswa with NIM ${nim}.`
            });
        }
        else res.send(`Mahasiswa dengan nim = ${nim} telah terhapus`)
    });
})


app.get('/', (req, res) => {
    res.send('server page')
});

app.listen(port, () => {
    console.log(`Server berjalan pada localhost:${port}`)
});