const express = require ('express'); 
const mysql = require('mysql2')
const app = express();
const port = 2500;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'filem'
});

connection.connect(error => {
    if (error) {
        console.log(error)
    };
    console.log('terhubung ke database filem')
})

app.get('/', (req, res) => {
    const qstring = "SELECT * FROM perfileman";
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
    const {kodeFilem, judul, tahunTayang, produser} = req.body

    connection.query("INSERT INTO perfileman (kodeFilem, judul, tahunTayang, produser) values (?,?,?,?) ", [kodeFilem, judul, tahunTayang, produser], (err) => {
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

app.get('/:kodeFilem', (req, res) => {
    const qstring = `SELECT * FROM perfileman WHERE kodeFilem = '${req.params.kodeFilem}'`;
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

app.put('/:kodeFilem', (req,res) => {
    const kodeFilem = req.params.kodeFilem;
    const filem = req.body;
    const qstring = `UPDATE perfileman
                    SET judul = '${filem.judul}', tahunTayang = '${filem.tahunTayang}', produser = '${filem.produser}'
                    WHERE kodeFilem = '${kodeFilem}'`
    connection.query(qstring, (err,data) => {
        if(err) {
            res.status(500).send({
                message: "Error updating perfileman with kodeFilem" + kodeFilem
            });
        }
        else if(data.affectedRows ==0){
            res.status(404),send({
                message: `Not found perfileman with kodeFilem ${kodeFilem}.`
            });
        }
        else {
            console.log("update perfileman: ", {kodeFilem: kodeFilem, ...filem});
            res.send({kodeFilem: kodeFilem, ...filem});
        }
    })
})

app.delete('/:kodeFilem', (req,res) => {
    const kodeFilem = req.params.kodeFilem
    const qstring = `DELETE FROM perfileman WHERE kodeFilem = '${kodeFilem}'`
    connection.query(qstring, (err, data) => {
        if(err) {
            res.status(500).send({
                message: "Error deleting filem with kodeFilem " + kodeFilem
            });
        }
        else if (data.affectedRows == 0){
            res.status(404).send({
                message: `Not found filem with kodeFilem ${kodeFilem}.`
            });
        }
        else res.send(`filem dengan kodeFilem = ${kodeFilem} telah terhapus`)
    });
})


app.get('/', (req, res) => {
    res.send('server page')
});

app.listen(port, () => {
    console.log(`Server berjalan pada localhost:${port}`)
});