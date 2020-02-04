const options = {}
var mysql           = require('mysql');
const express       = require('express');
const app           = express();
var server          = require('http').Server(options, app);
const bodyParser    = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());                                           
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));        
app.use(bodyParser.urlencoded({ extended: true }));                     
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'tennisportal',
    password : 'Portal123',
    database : 'projektbazy',
    port: 3306
   });

app.get('/ping', function(request, response){
    response.send(new Date().toISOString())
})

app.post('/delcr', function(request, response){
    connection.query('DELETE FROM sztab WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '"', function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        if(results.affectedRows == 0){
            response.send(403, "Nie znaleziono członka sztabu o podanym imieniu i nazwisku.")
            return
        }
        response.send(200, "Usunięto członka sztabu.")
        return
    })
})

app.post('/results', function(request, response){
    console.log(request.body.query_str)
    connection.query(request.body.query_str, function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403)
            return
        }
        for(var i = 0; i < results.length; i++){
            if(results[i].data_rozpoczęcia != undefined){
                var dat = results[i].data_rozpoczęcia
                dat.setDate(dat.getDate() + 1)
                dat = dat.toISOString().slice(0,10)
                results[i].data_rozpoczęcia = dat
            }
            if(results[i].data_zakończenia != undefined){
                var dat = results[i].data_zakończenia
                dat.setDate(dat.getDate() + 1)
                dat = dat.toISOString().slice(0,10)
                results[i].data_zakończenia = dat
            }
            if(results[i].data_meczu != undefined){
                var dat = results[i].data_meczu
                dat.setDate(dat.getDate() + 1)
                dat = dat.toISOString().slice(0,10)
                results[i].data_meczu = dat
            }
            if(results[i].data_urodzenia != undefined){
                var dat = results[i].data_urodzenia
                dat.setDate(dat.getDate() + 1)
                dat = dat.toISOString().slice(0,10)
                results[i].data_urodzenia = dat
            }
        }
        response.send(200, results)
        return
    })
})

app.post('/modcr', function(request, response){
    connection.query('select id_gracza from zawodnik where imie = "' + request.body.imie2 + '" and nazwisko = "' + request.body.nazwisko2 + '"', function(error, results, fields){
        if(results.length == 0){
            response.send(403, "Nie znaleziono zawodnika.")
            return
        }
        else{
            connection.query('select id_członka_sztabu from sztab where imie = "' + request.body.imie + '" and nazwisko = "' + request.body.nazwisko + '" and rola = "' + request.body.rola + '"', function(error, results2, fields){
                if(results2.length == 0){
                    response.send(403, "Nie znaleziono członka sztabu.")
                    return
                }
                else{
                    connection.query('insert into wspolpraca(data_rozpoczęcia, zawodnik_id_gracza, sztab_id_członka_sztabu) values("' + request.body.dat + '", ' + results[0].id_gracza + ', ' + results2[0].id_członka_sztabu + ')', function(error,results3,fields){
                        if (error) { 
                            console.error(error)
                            response.send(403, "Podano dane w niewłaściwym formacie.")
                            return
                        }
                        response.send(200, "Wprowadzono współpracę.")
                        return
                    })
                }
            })
        }
    })
})

app.post('/modcr2', function(request, response){
    connection.query('select id_gracza from zawodnik where imie = "' + request.body.imie2 + '" and nazwisko = "' + request.body.nazwisko2 + '"', function(error, results, fields){
        if(results.length == 0){
            response.send(403, "Nie znaleziono zawodnika.")
            return
        }
        else{
            connection.query('select id_członka_sztabu from sztab where imie = "' + request.body.imie + '" and nazwisko = "' + request.body.nazwisko + '"', function(error, results2, fields){
                if(results2.length == 0){
                    response.send(403, "Nie znaleziono członka sztabu.")
                    return
                }
                else{
                    connection.query('update wspolpraca set data_zakończenia = "' + request.body.dat + '" where zawodnik_id_gracza = ' + results[0].id_gracza + ' and sztab_id_członka_sztabu = ' + results2[0].id_członka_sztabu + ' and data_rozpoczęcia < "' + request.body.dat + '"', function(error,results3,fields){
                        if (error) { 
                            console.error(error)
                            response.send(403, "Podano dane w niewłaściwym formacie.")
                            return
                        }
                        if(results3.affectedRows == 0){
                            response.send(403, "Nie znaleziono współpracy lub podano błędną datę zakończenia.")
                        }
                        response.send(200, "Zmodyfikowano współpracę.")
                        return
                    })
                }
            })
        }
    })
})

app.post('/inscr', function(request, response){
    connection.query('insert into sztab(imie, nazwisko, rola) values("' + request.body.imie + '", "' + request.body.nazwisko + '", "' + request.body.rola + '")', function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        response.send(200, "Wprowadzono członka sztabu.")
        return
    })
})

app.post('/delpl', function(request, response){
    connection.query('DELETE FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '"', function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        if(results.affectedRows == 0){
            response.send(403, "Nie znaleziono zawodnika o podanym imieniu i nazwisku.")
            return
        }
        response.send(200, "Usunięto zawodnika.")
        return
    })
})

app.post('/modpa', function(request, response){
    connection.query('select id_udzialu FROM udzial WHERE zawodnik_id_gracza = (select id_gracza from zawodnik where imie = "' + request.body.imie +'" and nazwisko = "' + 
    request.body.nazwisko + '") and turniej_nazwa = "' + request.body.nazwa + '" and turniej_rok = ' + request.body.rok, function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        if(results.length == 0){
            response.send(403, "Dany zawodnik nie grał w tym turnieju")
            return
        }
        else{
            connection.query('select id_udzialu FROM udzial WHERE zawodnik_id_gracza = (select id_gracza from zawodnik where imie = "' + request.body.imie2 +'" and nazwisko = "' + 
            request.body.nazwisko2 + '") and turniej_nazwa = "' + request.body.nazwa + '" and turniej_rok = ' + request.body.rok, function(error, results2, fields){
                if (error) { 
                    console.error(error)
                    response.send(403, "Podano dane w niewłaściwym formacie.")
                    return
                }
                if(results2.length == 0){
                    response.send(403, "Dany zawodnik nie grał w tym turnieju")
                    return
                }
                else{
                    connection.query('select id_udzialu_deblowego from deblowy where udzial_id_udzialu = ' + results[0].id_udzialu, function(error,results3,fields){
                        if (error) { 
                            console.error(error)
                            response.send(403, "Podano dane w niewłaściwym formacie.")
                            return
                        }
                        if(results3.length == 0){
                            response.send(403, "Dany zawodnik nie grał w tym turnieju")
                            return
                        }
                        else{
                            connection.query('select id_udzialu_deblowego from deblowy where udzial_id_udzialu = ' + results2[0].id_udzialu, function(error, results4, fields){
                                if (error) { 
                                    console.error(error)
                                    response.send(403, "Podano dane w niewłaściwym formacie.")
                                    return
                                }
                                if(results4.length == 0){
                                    response.send(403, "Dany zawodnik nie grał w tym turnieju")
                                    return
                                }
                                else{
                                    connection.query('update deblowy set Deblowy_id_udzialu_deblowego = ' + results3[0].id_udzialu_deblowego + ' where id_udzialu_deblowego = ' + results4[0].id_udzialu_deblowego, function(error, results5, fields){

                                    })
                                    connection.query('update deblowy set Deblowy_id_udzialu_deblowego = ' + results4[0].id_udzialu_deblowego + ' where id_udzialu_deblowego = ' + results3[0].id_udzialu_deblowego, function(error, results5, fields){

                                    })
                                    response.send(200, "Ustawiono parę deblową w podanym turnieju")
                                    return
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

app.post('/inspl', function(request, response){
    connection.query('INSERT INTO zawodnik(imie, nazwisko, narodowość, data_urodzenia, wzrost, preferowana_ręka, punkty_singlowe, punkty_deblowe, płeć) VALUES("' + request.body.imie + '", "' + request.body.nazwisko + '", "' + request.body.kraj + '", "' + 
    request.body.dat + '", ' + request.body.wzrost +', "' + request.body.reka + '", 0, 0, "' + request.body.plec + '")', function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        connection.query('select count(*) as liczba from zawodnik where płeć = "' + request.body.plec + '"', function(error, results,fields){
            connection.query('select id_gracza from zawodnik where imie = "' + request.body.imie + '" and nazwisko = "' + request.body.nazwisko + '"',function(error, results3,fields){
                if(request.body.plec == "kobieta"){
                    connection.query('insert into pozycja(data_od, pozycja, ranking_rodzaj_rankingu, zawodnik_id_gracza) values(current_date(), ' + 
                    results[0].liczba + ', "singlowy kobiet", ' + results3[0].id_gracza + ')', function(error, results2, fields){
                    })
                    connection.query('insert into pozycja(data_od, pozycja, ranking_rodzaj_rankingu, zawodnik_id_gracza) values(current_date(), ' + 
                    results[0].liczba + ', "deblowy kobiet", ' + results3[0].id_gracza + ')', function(error, results2, fields){
                    })
                }
                else{
                    connection.query('insert into pozycja(data_od, pozycja, ranking_rodzaj_rankingu, zawodnik_id_gracza) values(current_date(), ' + 
                    results[0].liczba + ', "singlowy mężczyzn", ' + results3[0].id_gracza + ')', function(error, results2, fields){
                    })
                    connection.query('insert into pozycja(data_od, pozycja, ranking_rodzaj_rankingu, zawodnik_id_gracza) values(current_date(), ' + 
                    results[0].liczba + ', "deblowy mężczyzn", ' + results3[0].id_gracza + ')', function(error, results2, fields){
                    })
                }          
            })
        })
        response.send(200, "Wprowadzono zawodnika.")
        return
    })
})

app.post('/inspa', function(request, response){
    connection.query('select id_gracza from zawodnik where imie = "' + request.body.imie + '" and nazwisko = "' + request.body.nazwisko + '"', function(error,results,fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        if(results.length == 0){
            response.send(403, "Nie znaleziono podanego zawodnika.")
            return
        }
        else{
            connection.query('select * from turniej where nazwa = "' + request.body.nazwa + '" and rok = ' + request.body.rok, function(error, results2, fields){
                if (error) { 
                    console.error(error)
                    response.send(403, "Podano dane w niewłaściwym formacie.")
                    return
                }
                if(results.length == 0){
                    response.send(403, "Nie znaleziono podanego turnieju.")
                    return
                }
                else{
                    if(request.body.roz != ""){
                        connection.query('insert into udzial(rozstawienie, rezultat, liczba_zdobytych_punktów, turniej_nazwa, turniej_rok, zawodnik_id_gracza) values(' + 
                        request.body.roz + ', "' + request.body.rez + '", ' + request.body.punkty + ', "' + request.body.nazwa + '", ' + request.body.rok + ', ' + results[0].id_gracza + ')', function(error, results2, fields){
                            if (error) { 
                                console.error(error)
                                response.send(403, "Podano dane w niewłaściwym formacie.")
                                return
                            }
                            connection.query('CALL calc_points(' + results[0].id_gracza + ')', function(error, results2, fields){
                            })
                            connection.query('call update_rank()', function(error, results2, fields){
                            })
                            connection.query('select id_udzialu from udzial where zawodnik_id_gracza = ' + results[0].id_gracza + ' and turniej_nazwa = "' + 
                            request.body.nazwa + '" and turniej_rok = ' + request.body.rok, function(error,results3,fields){
                                connection.query('insert into ' + request.body.sindeb + '(udzial_id_udzialu) values(' + results3[0].id_udzialu + ')', function(error,results4, fields){
                                })
                            })
                            response.send(200, "Wstawiono udział.")
                        })
                    }
                    else{
                        connection.query('insert into udzial(rezultat, liczba_zdobytych_punktów, turniej_nazwa, turniej_rok, zawodnik_id_gracza) values("' + request.body.rez + '", ' + 
                        request.body.punkty + ', "' + request.body.nazwa + '", ' + request.body.rok + ', ' + results[0].id_gracza + ')', function(error, results2, fields){
                            if (error) { 
                                console.error(error)
                                response.send(403, "Podano dane w niewłaściwym formacie.")
                                return
                            }
                            connection.query('CALL calc_points(' + results[0].id_gracza + ')', function(error, results2, fields){
                            })
                            connection.query('call update_rank()', function(error, results2, fields){
                            })
                            connection.query('select id_udzialu from udzial where zawodnik_id_gracza = ' + results[0].id_gracza + ' and turniej_nazwa = "' + 
                            request.body.nazwa + '" and turniej_rok = ' + request.body.rok, function(error,results3,fields){
                                connection.query('insert into ' + request.body.sindeb + '(udzial_id_udzialu) values(' + results3[0].id_udzialu + ')', function(error,results4, fields){
                                })
                            })
                            response.send(200, "Wstawiono udział.")
                        })
                    }
                }
            })
        }
    })
})


app.post('/insto', function(request, response){
    if(request.body.data2 != ""){
        connection.query('insert into turniej values("' + request.body.nazwa + '", ' + request.body.rok + ', "' + request.body.ranga + '", "' + request.body.naw + 
        '", "' + request.body.miasto + '", "' + request.body.kraj + '", ' + request.body.pula + ', "' + request.body.data1 + '", "' + request.body.data2 + '")', function(error,results,fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            response.send(200, "Wstawiono turniej")
            return
        })
    }
    else{
        connection.query('insert into turniej(nazwa, rok, ranga, nawierzchnia, miasto, kraj, pula_nagród, data_rozpoczęcia) values("' + request.body.nazwa + '", ' + request.body.rok + ', "' + request.body.ranga + '", "' + request.body.naw + 
        '", "' + request.body.miasto + '", "' + request.body.kraj + '", ' + request.body.pula + ', "' + request.body.data1 + '")', function(error,results,fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            response.send(200, "Wstawiono turniej")
            return
        })
    }
})

app.post('/insma', function(request, response){
    connection.query('select * from turniej where nazwa = "' + request.body.nazwa + '" and rok = ' + request.body.rok, function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        if(results.length == undefined){
            response.send(403, "Nie znaleiono podanego turnieju")
            return
        }
        else{
            connection.query('select * from zawodnik where imie = "' + request.body.imie + '" and nazwisko = "' + request.body.nazwisko + '"', function(error, results, fields){
                if (error) { 
                    console.error(error)
                    response.send(403, "Podano dane w niewłaściwym formacie.")
                    return
                }
                if(results.length == undefined){
                    response.send(403, "Nie znaleziono podanego zawodnika")
                    return
                }
                else{
                    connection.query('select * from zawodnik where imie = "' + request.body.imie2 + '" and nazwisko = "' + request.body.nazwisko2 + '"', function(error, results, fields){
                        if (error) { 
                            console.error(error)
                            response.send(403, "Podano dane w niewłaściwym formacie.")
                            return
                        }
                        if(results.length == undefined){
                            response.send(403, "Nie znaleiono podanego zawodnika")
                            return
                        }
                        else{
                            connection.query('select * from udzial join zawodnik on zawodnik_id_gracza = id_gracza right outer join ' + request.body.sindeb + ' on id_udzialu = udzial_id_udzialu where turniej_nazwa = "' + request.body.nazwa +
                                '" and turniej_rok = ' + request.body.rok + ' and id_gracza = (select id_gracza from zawodnik where imie = "' + request.body.imie + 
                                '" and nazwisko = "' + request.body.nazwisko + '")', function(error, results6, fields){
                                if (error) { 
                                    console.error(error)
                                    response.send(403, "Podano dane w niewłaściwym formacie.")
                                    return
                                }
                                if(results6.length == undefined){
                                    response.send(403, "Zawodnik nie grał w danym turnieju.")
                                    return
                                }
                                else{
                                    connection.query('select * from udzial join zawodnik on zawodnik_id_gracza = id_gracza right outer join ' + request.body.sindeb + ' on id_udzialu = udzial_id_udzialu where turniej_nazwa = "' + request.body.nazwa +
                                        '" and turniej_rok = ' + request.body.rok + ' and id_gracza = (select id_gracza from zawodnik where imie = "' + request.body.imie2 + 
                                        '" and nazwisko = "' + request.body.nazwisko2 + '")', function(error, results7, fields){
                                        if (error) { 
                                            console.error(error)
                                            response.send(403, "Podano dane w niewłaściwym formacie.")
                                            return
                                        }
                                        if(results7.length == undefined){
                                            response.send(403, "Zawodnik nie grał w danym turnieju.")
                                            return
                                        }
                                        else{
                                            connection.query('insert into mecz values("' + request.body.dat + '", "' + request.body.etap + '", "' + request.body.wynik + '", "' + request.body.sindeb + '", ' + results6[0].id_udzialu + ', ' + results7[0].id_udzialu + ', "' + request.body.nazwa + '"' + ')', function(error, results, fields){
                                                if (error) { 
                                                    console.error(error)
                                                    response.send(403, "Podano dane w niewłaściwym formacie.")
                                                    return
                                                }
                                                response.send(200, "Wstawiono mecz.")
                                                    return
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })   
})

app.post('/modpl', function(request, response){
    if(request.body.imie == ""){
        request.body.imie = null
    }
    if(request.body.nazwisko == ""){
        request.body.nazwisko = null
    }
    if(request.body.kraj == ""){
        request.body.kraj= null
    }
    if(request.body.wzrost == ""){
        request.body.wzrost = null
    }
    if(request.body.reka == ""){
        request.body.reka = null
    }
    var n = 0
    var query_string = 'UPDATE zawodnik SET imie = coalesce("' + request.body.imie + '", imie), nazwisko = coalesce("' + request.body.nazwisko + '", nazwisko), ' +
    'narodowość = coalesce("' + request.body.kraj + '", narodowość), wzrost = coalesce(' + request.body.wzrost + ', wzrost), ' +
    'preferowana_ręka = coalesce("' + request.body.reka + '", preferowana_ręka) WHERE imie = "' + request.body.imie2 +'" and nazwisko = "' + request.body.nazwisko2 + '"'
    while(n != -1){
        n = query_string.indexOf('"null"')
        if(n != -1){
            query_string = query_string.substring(0, n+5) + query_string.substring(n+6, query_string.length)
            query_string = query_string.substring(0, n) + query_string.substring(n+1, query_string.length)
        }
    }
    connection.query(query_string, function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        if(results.affectedRows == 0){
            response.send(403, "Nie znaleziono zawodnika.")
        }
        response.send(200, "Zmodyfikowano dane zawodnika.")
        return
    })
})

app.post('/modto', function(request, response){
    connection.query('select * from turniej where nazwa = "' + request.body.nazwa + '" and rok = ' + request.body.rok, function(error, results, fields){
        if (error) { 
            console.error(error)
            response.send(403, "Podano dane w niewłaściwym formacie.")
            return
        }
        if(results.length == 0){
            response.send(403, "Nie znaleziono turnieju.")
            return
        }
        else{
            connection.query('update turniej set data_zakończenia = "' + request.body.dat + '" where nazwa = "' + request.body.nazwa + '" and rok = ' + request.body.rok + ' and data_rozpoczęcia < "' + request.body.dat + '"', function(error, results, fields){
                if (error) { 
                    console.error(error)
                    response.send(403, "Podano dane w niewłaściwym formacie.")
                    return
                }
                if(results.affectedRows == 0){
                    response.send(403, "Podano nieprawidłową datę.")
                    return
                }
                response.send(200, "Zmodyfikowano dane turnieju.")
                return
            })
        }
    })
})

app.post('/delto', function(request, response){
    if(request.body.rok != ""){
        connection.query('DELETE FROM turniej WHERE nazwa = "' + request.body.nazwa +'" and rok = "' + request.body.rok + '"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono turnieju.")
                return
            }
            response.send(200, "Usunięto turniej")
            return
        })
    }
    else{
        connection.query('DELETE FROM turniej WHERE nazwa = "' + request.body.nazwa +'"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono turnieju.")
                return
            }
            response.send(200, "Usunięto turniej/e.")
            return
        })
    }
})

app.post('/delpa', function(request, response){
    if(request.body.nazwa != "" && request.body.rok != ""){
        connection.query('DELETE FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza from zawodnik WHERE imie = "' + request.body.imie +
        '" and nazwisko = "' + request.body.nazwisko + '") and turniej_nazwa = "' + request.body.nazwa + '" and turniej_rok = "' + request.body.rok +'"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono udziału zawodnika w danych turniejach.")
                return
            }
        })
    }
    else if(request.body.nazwa != ""){
        connection.query('DELETE FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza from zawodnik WHERE imie = "' + request.body.imie +
        '" and nazwisko = "' + request.body.nazwisko + '") and turniej_nazwa = "' + request.body.nazwa + '"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono udziału zawodnika w danych turniejach.")
                return
            }
        })
    }
    else if(request.body.rok != 0){
        connection.query('DELETE FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza from zawodnik WHERE imie = "' + request.body.imie +
        '" and nazwisko = "' + request.body.nazwisko + '") and turniej_rok = "' + request.body.rok + '"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono udziału zawodnika w danym roku.")
                return
            }
        })
    }
    else{
        connection.query('DELETE FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza from zawodnik WHERE imie = "' + request.body.imie +
        '" and nazwisko = "' + request.body.nazwisko + '")', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono udziału zawodnika w danych turniejach.")
                return
            }
        })
    }
    connection.query('SELECT * FROM zawodnik WHERE imie = "' + request.body.imie + '" and nazwisko = "' + request.body.nazwisko +'"', function(error, results, fields){
        connection.query('CALL calc_points(' + results[0].id_gracza + ')', function(error, results, fields){
        })
    })
    connection.query('call update_rank()', function(error, results, fields){
    })
    response.send(200, "Usunięto udział/y zawodnika.")
    return
})

app.post('/delma', function(request, response){
    if(request.body.dat != "" && request.body.sindeb != ""){
        connection.query('DELETE FROM mecz WHERE (udzial_id_udzialu1 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '")) or ' +
            'udzial_id_udzialu2 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '"))) and singlowy_deblowy = "' +
            request.body.sindeb + '" and data_meczu = "' + request.body.dat + '"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono meczów o podanej charakterystyce")
                return
            }
            response.send(200, "Usunięto mecz/e.")
            return
        })
    }
    else if(request.body.sindeb != ""){
        connection.query('DELETE FROM mecz WHERE (udzial_id_udzialu1 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '")) or ' +
            'udzial_id_udzialu2 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '"))) and singlowy_deblowy = "' +
            request.body.sindeb + '"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono meczów o podanej charakterystyce")
                return
            }
            response.send(200, "Usunięto mecz/e.")
            return
        })
    }
    else if(request.body.dat != 0){
        connection.query('DELETE FROM mecz WHERE (udzial_id_udzialu1 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '")) or ' +
            'udzial_id_udzialu2 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '"))) and ' +
            'data_meczu = "' + request.body.dat + '"', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono meczów o podanej charakterystyce")
                return
            }
            response.send(200, "Usunięto mecz/e.")
            return
        })
    }
    else{
        connection.query('DELETE FROM mecz WHERE (udzial_id_udzialu1 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '")) or ' +
            'udzial_id_udzialu2 = (SELECT id_udzialu FROM udzial WHERE zawodnik_id_gracza = (SELECT id_gracza' +
            ' FROM zawodnik WHERE imie = "' + request.body.imie +'" and nazwisko = "' + request.body.nazwisko + '")))', function(error, results, fields){
            if (error) { 
                console.error(error)
                response.send(403, "Podano dane w niewłaściwym formacie.")
                return
            }
            if(results.affectedRows == 0){
                response.send(403, "Nie znaleziono meczów o podanej charakterystyce")
                return
            }
            response.send(200, "Usunięto mecz/e.")
            return
        })
    }
})

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
    } else {
        console.log("Połączono z bazą danych")
        server.listen(80)
    }
})
