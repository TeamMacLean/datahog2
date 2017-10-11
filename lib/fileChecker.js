const md5 = require('md5');
// const check = require('./lib/checker');
const fs = require('fs');
const path = require('path');
// const http = require('http');
// const ENA = require('./lib/ena');
// const config = require('./config');
//
// const RunModel = require("./models/run");
const ReadModel = require('../models/read');
const md5File = require('md5-file');

const read = (dir) =>
    fs.readdirSync(dir)
        .reduce((files, file) => {
                try {
                    const filePath = path.resolve(path.join(dir, file));
                    return fs.statSync(filePath).isDirectory() ?
                        files.concat(read(filePath)) :
                        files.concat(filePath)
                } catch (err) {
                    console.error(err);
                    return files;

                }
            },
            []);

//gff, fasta, fa, fq, fastq


module.exports = {
    generateReadMD5s: function (rootPath) {
//Generate MD5s for read files
        const files = read(rootPath);

        return Promise.all(
            files.map(file => {
                return new Promise((good, bad) => {
                    if (file.substr(file.length - 3).toLowerCase() !== 'md5') { //ignore *.md5 files
                        const md5Path = path.join(path.dirname(file), '.' + path.basename(file) + '.md5')
                        if (!fs.existsSync(md5Path)) {//check if md5 files exists
                            const hash = md5File.sync(file);
                            console.log(`${file} ${hash}`);
                            fs.writeFile(md5Path, hash, function (err) {
                                if (err) {
                                    return bad(err);
                                }
                                return good();
                            })
                        } else {
                            return good(); //it already exists
                        }
                    }
                    return good();
                })
            })
        )
    },

    compareMD5s: function (rootPath) {
        const files = read(rootPath);

        Promise.all(
            files.map(file => {

                return new Promise((good, bad) => {

                    //check if file starts with '.' AND ends with '.md5'
                    if (path.basename(file)[0] === '.' && file.substr(file.length - 3).toLowerCase() === 'md5') {
                        // console.log(file);

                        try {
                            const MD5String = fs.readFileSync(file, 'utf8');
                            // console.log(MD5String);

                            ReadModel.filter({checksum: MD5String})
                                .then(reads => {
                                    if (reads && reads.length) {
                                        console.log('found', reads[0].fileName);
                                        // console.log(reads);

                                        return good();
                                    } else {
                                        return good();
                                    }
                                })
                        } catch (err) {
                            return bad(err);
                        }

                    }
                    return good();
                })
            })
        )
    }



    // RunModel
    //     .getJoin({reads: true})
    //     .then(runs => {
    //         runs.map(run => {
    //             run.reads.map(read => {
    //                 console.log(read.checksum);
    //             })
    //         })
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     })

};


