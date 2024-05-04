const express = require('express');
const app = express();
const port = 5000;

app.use(express.json()); //mengambil body berupa json

//contohbody
app.post('/buku', (req,res) => {
    const thTerbit = req.body.thTerbit;
    const penerbit = req.body.penerbit;
    const judul = req.body.judul;

    const msg = {   status :"sukses",
                    data : {"Tahun": thTerbit, "penerbit" : penerbit, "judul": judul}};
    res.send(msg);
});

app.post('/mahasiswa', (req,res) => {
    const nim = req.body.nim;
    const nama = req.body.nama;

    const msg = {   status :"sukses",
                    data : {"nim": nim, "nama" : nama}};
    res.send(msg);
});

app.get('/', (req,res) => {
    res.send('Hallo BIBIII!')
});

app.get('/mahasiswa', (req,res) => {
    res.send('Get data Mahasiswa!')
});

//params
app.get('/mahasiswa/:nim',(req,res) => {
    const nim = req.params.nim;

    res.send(`Mahasiswa dengan nim : : ${nim} ditemukan`)
});

//params
app.get('/nilai/:nim/:semester',(req,res) => {
    const nim = req.params.nim;
    const semester = req.params.semester;
    res.send(`Nilai Mahasiswa dengan nim : ${nim} semester ${semester} ditemukan`)
});

//query
app.get('/get-mahasiswa-by-nim', (req,res) => {
    const nim = req.query.nim;

    res.send(`Mahasiswa dengan nim: ${nim} ditemukan`)
});

//contohquery1
app.get('/get-buku-by-thTerbit', (req,res) => {
    const thTerbit = req.query.thTerbit;

    res.send(`buku yang terbit pada tahun : ${thTerbit} telah tersedia`)
});

//query
app.get('/nilai-persemester', (req,res) => {
    const nim = req.query.nim;
    const semester = req.query.semester;

    res.send(`Mahasiswa dengan nim: ${nim} semester ${semester} ditemukan`)
});

//contoh query2
app.get('/buku-penerbit', (req,res) => {
    const thTerbit = req.query.thTerbit;
    const penerbit = req.query.penerbit;
     
    res.send(`Buku yang diterbitkan oleh ${penerbit} pada tahun ${thTerbit} telah terdata`)
})

app.post('/', (req,res) => {
    res.send('Post Data')
})

app.put('/', (req,res) => {
    res.send('Update data sukses!')
})

app.delete('/', (req,res) => {
    res.send('Data Berhasil dihapus')
})

app.listen(port, () => {
    console.log(`server berjalan pada localhost:${port}`);
});