var query_string = ""
var tab = ""
var globnaz1 = '(select distinct nazwisko from udzial inner join mecz on udzial.id_udzialu = mecz.udzial_id_udzialu1 inner join zawodnik on udzial.zawodnik_id_gracza = ' + 
'zawodnik.id_gracza where m.udzial_id_udzialu1 = mecz.udzial_id_udzialu1)'
var globnaz2 = '(select distinct nazwisko from udzial inner join mecz on udzial.id_udzialu = mecz.udzial_id_udzialu2 inner join zawodnik on udzial.zawodnik_id_gracza = ' +
'zawodnik.id_gracza where m.udzial_id_udzialu2 = mecz.udzial_id_udzialu2)'
var globnaz3 = '(select nazwisko from zawodnik inner join udzial on zawodnik.id_gracza = udzial.zawodnik_id_gracza where ' + 
'udzial.zawodnik_id_gracza = u.zawodnik_id_gracza)'
var globim1 = '(select imie from zawodnik inner join udzial on zawodnik.id_gracza = udzial.zawodnik_id_gracza where ' + 
'udzial.zawodnik_id_gracza = u.zawodnik_id_gracza)'
$(function(){
    $("#Startowy").show()
})

function AdvRes(){
    $("#Results").hide()
    if(tab == "ranking"){
        $("#AdvRank").show()
    }
    if(tab == "mecz"){
        $("#AdvMat").show()
    }
    if(tab == "udzial"){
        $("#AdvPa").show()
    }
    if(tab == "sztab"){
        $("#AdvCr").show()
    }
    if(tab == "turniej"){
        $("#AdvTo").show()
    }
    if(tab == "zawodnik"){
        $("#AdvPl").show()
    }
}

function HideAdvPl(){
    $("#Results").show()
    $("#AdvPl").hide()
    $("#advplmsg").text("")
    $("#advplmsg").removeClass("alert alert-danger")
}

function AdvPlAcc(){
    if($("#advplim").val() == "" && $("#advplnaz").val() == "" && $("#advplpl").val() == "" && $("#advplnar").val() == "" && $("#advplyear").val() == "" && $("#advplhan").val() == "" && $("#advplwzr1").val() == "" && $("#advplwzr2").val() == "" && !$("#sorpl1").is(':checked') && !$("#sorpl2").is(':checked') && !$("#sorpl3").is(':checked') && !$("#sorpl4").is(':checked') && !$("#sorpl5").is(':checked') && !$("#sorpl6").is(':checked')){
        HideAdvPl()
        return
    }
    if(parseInt($("#advplwzr1").val()) > parseInt($("#advplwzr2").val())){
        $("#advplmsg").text("Górna granica przedziału wzrostu musi być większa od dolnej.")
        $("#advplmsg").addClass("alert alert-danger")
        return
    }
    var query_string2 = query_string
    var ifwhere = false
    if($("#advplim").val() != ""){
        query_string2 = query_string2 + ' where imie like "%' + $("#advplim").val() + '%"'
        ifwhere = true
    }
    if($("#advplnaz").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where nazwisko like "%' + $("#advplnaz").val() + '%"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and nazwisko like "%' + $("#advplnaz").val() + '%"'
        }
    }
    if($("#advplpl").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where płeć = "' + $("#advplpl").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and płeć = "' + $("#advplpl").val() + '"'
        }
    }
    if($("#advplnar").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where narodowość = "' + $("#advplnar").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and narodowość = "' + $("#advplnar").val() + '"'
        }
    }
    if($("#advplhan").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where preferowana_ręka = "' + $("#advplhan").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and preferowana_ręka = "' + $("#advplhan").val() + '"'
        }
    }
    if($("#advplyear").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where extract(year from data_urodzenia) = ' + $("#advplyear").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and extract(year from data_urodzenia) = ' + $("#advplyear").val()
        }
    }
    if($("#advplwzr1").val() != "" && $("#advplwzr2").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where wzrost between ' + $("#advplwzr1").val() + ' and ' + $("#advplwzr2").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and (wzrost between ' + $("#advplwzr1").val() + ' and ' + $("#advplwzr2").val() + ')'
        }
    }
    if($("#advplwzr1").val() != "" && $("#advplwzr2").val() == ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where wzrost >= ' + $("#advplwzr1").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and wzrost >= ' + $("#advplwzr1").val() 
        }
    }
    if($("#advplwzr1").val() == "" && $("#advplwzr2").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where wzrost <= ' + $("#advplwzr2").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and wzrost <= ' + $("#advplwzr2").val() 
        }
    }
    var ord = false
    if($("#sorpl1").is(':checked')){
        query_string2 = query_string2 + ' order by nazwisko asc'
        ord = true
    }
    if($("#sorpl2").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by nazwisko desc'
            ord = true
        }
        else{
            $("#advplmsg").text("Należy sortować według jednego elementu.")
            $("#advplmsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpl3").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by data_urodzenia asc'
            ord = true
        }
        else{
            $("#advplmsg").text("Należy sortować według jednego elementu.")
            $("#advplmsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpl4").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by data_urodzenia desc'
            ord = true
        }
        else{
            $("#advplmsg").text("Należy sortować według jednego elementu.")
            $("#advplmsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpl5").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by wzrost asc'
            ord = true
        }
        else{
            $("#advplmsg").text("Należy sortować według jednego elementu.")
            $("#advplmsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpl6").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by wzrost desc'
            ord = true
        }
        else{
            $("#advplmsg").text("Należy sortować według jednego elementu.")
            $("#advplmsg").addClass("alert alert-danger")
            return
        }
    }
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        var res_str = ""
        for(var i = 0; i < response.data.length; i++){
            res_str = res_str + response.data[i].imie + ' ' + response.data[i].nazwisko + ' '
            if(response.data[i].narodowość != undefined){
                res_str = res_str + response.data[i].narodowość + ' ' 
            }
            if(response.data[i].data_urodzenia!= undefined){
                res_str = res_str + response.data[i].data_urodzenia + ' '
            }
            if(response.data[i].wzrost != undefined){
                res_str = res_str + response.data[i].wzrost + ' '
            }
            if(response.data[i].preferowana_ręka != undefined){
                res_str = res_str + response.data[i].preferowana_ręka + ' '
            }
            if(response.data[i].punkty_singlowe != undefined){
                res_str = res_str + response.data[i].punkty_singlowe + ' ' + response.data[i].poz1 + ' '
            }
            if(response.data[i].punkty_deblowe != undefined){
                res_str = res_str + response.data[i].punkty_deblowe + ' ' + response.data[i].poz2 + ' '
            }
            res_str = res_str + '\n'
        }
        $("#resultsmsg").text(res_str)
        HideAdvPl()
    })
    .catch(function (error){
        $("#advplmsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advplpmsg").addClass("alert alert-danger")
    })
}

function HideAdvTo(){
    $("#Results").show()
    $("#AdvTo").hide()
    $("#advtomsg").text("")
    $("#advtomsg").removeClass("alert alert-danger")
}

function AdvToAcc(){
    if($("#advtoname").val() == "" && $("#advtoyear").val() == "" && $("#advtoran").val() == "" && $("#advtonaw").val() == "" && $("#advtomia").val() == "" && $("#advtokra").val() == "" && $("#advtopul1").val() == "" && $("#advtopul2").val() == "" && !$("#sorto1").is(':checked') && !$("#sorto2").is(':checked') && !$("#sorto3").is(':checked') && !$("#sorto4").is(':checked') && !$("#sorto5").is(':checked') && !$("#sorto6").is(':checked')){
        HideAdvTo()
        return
    }
    if(parseInt($("#advtopul1").val()) > parseInt($("#advtopul2").val())){
        $("#advtomsg").text("Górna granica przedziału puli nagród musi być większa od dolnej.")
        $("#advtomsg").addClass("alert alert-danger")
        return
    }
    var query_string2 = query_string
    var ifwhere = false
    if($("#advtoname").val() != ""){
        query_string2 = query_string2 + ' where nazwa like "%' + $("#advtoname").val() + '%"'
        ifwhere = true
    }
    if($("#advtoyear").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where rok = ' + $("#advtoyear").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and rok = ' + $("#advtoyear").val()
        }
    }
    if($("#advtoran").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where ranga = "' + $("#advtoran").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and ranga = "' + $("#advtoran").val() + '"'
        }
    }
    if($("#advtonaw").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where nawierzchnia = "' + $("#advtonaw").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and nawierzchnia = "' + $("#advtonaw").val() + '"'
        }
    }
    if($("#advtomia").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where miasto = "' + $("#advtomia").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and miasto = "' + $("#advtomia").val() + '"'
        }
    }
    if($("#advtokra").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where kraj = "' + $("#advtokra").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and kraj = "' + $("#advtokra").val() + '"'
        }
    }
    if($("#advtopul1").val() != "" && $("#advtopul2").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where pula_nagród between ' + $("#advtopul1").val() + ' and ' + $("#advtopul2").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and (pula_nagród between ' + $("#advtopul1").val() + ' and ' + $("#advtopul2").val() + ')'
        }
    }
    if($("#advtopul1").val() != "" && $("#advtopul2").val() == ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where pula_nagród >= ' + $("#advtopul1").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and pula_nagród >= ' + $("#advtopul1").val() 
        }
    }
    if($("#advtopul1").val() == "" && $("#advtopul2").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where pula_nagród <= ' + $("#advtopul2").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and pula_nagród <= ' + $("#advtopul2").val() 
        }
    }
    var ord = false
    if($("#sorto1").is(':checked')){
        query_string2 = query_string2 + ' order by nazwa asc'
        ord = true
    }
    if($("#sorto2").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by nazwa desc'
            ord = true
        }
        else{
            $("#advtomsg").text("Należy sortować według jednego elementu.")
            $("#advtomsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorto3").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by data_rozpoczęcia asc'
            ord = true
        }
        else{
            $("#advtomsg").text("Należy sortować według jednego elementu.")
            $("#advtomsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorto4").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by data_rozpoczęcia desc'
            ord = true
        }
        else{
            $("#advtomsg").text("Należy sortować według jednego elementu.")
            $("#advtomsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorto5").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by pula_nagród desc'
            ord = true
        }
        else{
            $("#advtomsg").text("Należy sortować według jednego elementu.")
            $("#advtomsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorto6").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by pula_nagród asc'
            ord = true
        }
        else{
            $("#advtomsg").text("Należy sortować według jednego elementu.")
            $("#advtomsg").addClass("alert alert-danger")
            return
        }
    }
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        var res_str = ""
        for(var i = 0; i < response.data.length; i++){
            res_str = res_str + response.data[i].nazwa + ' ' + response.data[i].rok + ' '
            if(response.data[i].ranga != undefined){
                res_str = res_str + response.data[i].ranga + ' ' 
            }
            if(response.data[i].nawierzchnia != undefined){
                res_str = res_str + response.data[i].nawierzchnia + ' '
            }
            if(response.data[i].miasto != undefined){
                res_str = res_str + response.data[i].miasto + ' '
            }
            if(response.data[i].kraj != undefined){
                res_str = res_str + response.data[i].kraj + ' '
            }
            if(response.data[i].pula_nagród != undefined){
                res_str = res_str + response.data[i].pula_nagród + ' '
            }
            if(response.data[i].data_rozpoczęcia != undefined){
                res_str = res_str + response.data[i].data_rozpoczęcia + ' ' 
            }
            if(response.data[i].data_zakończenia != undefined){
                res_str = res_str + response.data[i].data_zakończenia + ' '
            }
            res_str = res_str + '\n'
        }
        $("#resultsmsg").text(res_str)
        HideAdvTo()
    })
    .catch(function (error){
        $("#advtomsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advtomsg").addClass("alert alert-danger")
    })
}

function HideAdvRank(){
    $("#Results").show()
    $("#AdvRank").hide()
    $("#advrankmsg").text("")
    $("#advrankmsg").removeClass("alert alert-danger")
}

function HideAdvCr(){
    $("#Results").show()
    $("#AdvCr").hide()
    $("#advcrmsg").text("")
    $("#advcrmsg").removeClass("alert alert-danger")
}

function HideAdvPa(){
    $("#Results").show()
    $("#AdvPa").hide()
    $("#advpamsg").text("")
    $("#advpamsg").removeClass("alert alert-danger")
}

function AdvCrAcc(){
    if($("#advcrim").val() == "" && $("#advcrnaz").val() == "" && $("#advcrim2").val() == "" && $("#advcrnaz2").val() == "" && $("#advcrrol").val() == "" && !$("#sorcr1").is(':checked') && !$("#sorcr2").is(':checked')){
        HideAdvCr()
        return
    }
    if($("#sorcr1").is(':checked') && $("#sorcr2").is(':checked')){
        $("#advcrmsg").text("Nie można sortować jednocześnie alfabetycznie i odwrotnie.")
        $("#advcrmsg").addClass("alert alert-danger")
        return
    }
    var query_string2 = query_string
    var ifwhere = false
    if($("#advcrim").val() != ""){
        query_string2 = query_string2 + ' where sztab.imie like "%' + $("#advcrim").val() + '%"'
        ifwhere = true
    }
    if($("#advcrnaz").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where sztab.nazwisko like "%' + $("#advcrnaz").val() + '%"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and sztab.nazwisko like "%' + $("#advcrnaz").val() + '%"'
        }
    }
    if($("#advcrnaz2").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where zawodnik.nazwisko like "%' + $("#advcrnaz2").val() + '%"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and zawodnik.nazwisko like "%' + $("#advcrnaz2").val() + '%"'
        }
    }
    if($("#advcrim2").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where zawodnik.imie like "%' + $("#advcrim2").val() + '%"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and zawodnik.imie like "%' + $("#advcrim2").val() + '%"'
        }
    }
    if($("#advcrrol").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where sztab.rola = "' + $("#advcrrol").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and sztab.rola = "' + $("#advcrrol").val() + '"'
        }
    }
    if($("#sorcr1").is(':checked')){
        query_string2 = query_string2 + ' order by sztab.nazwisko asc'
    }
    if($("#sorcr2").is(':checked')){
        query_string2 = query_string2 + ' order by sztab.nazwisko desc'
    }
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        var res_str = ""
        for(var i = 0; i < response.data.length; i++){
            res_str = res_str + response.data[i].imie_sztab + ' ' + response.data[i].nazwisko_sztab + ' '
            if(response.data[i].rola != undefined){
                res_str = res_str + response.data[i].rola + ' ' 
            }
            if(response.data[i].imie_zawodnik != undefined){
                res_str = res_str + response.data[i].imie_zawodnik + ' ' + response.data[i].nazwisko_zawodnik + ' '
            }
            if(response.data[i].data_rozpoczęcia != undefined){
                console.log(response.data[i].data_rozpoczęcia)
                res_str = res_str + response.data[i].data_rozpoczęcia + ' '
            }
            if(response.data[i].data_zakończenia != undefined){
                res_str = res_str + response.data[i].data_zakończenia + ' '
            }
            res_str = res_str + '\n'
        }
        $("#resultsmsg").text(res_str)
        HideAdvCr()
    })
    .catch(function (error){
        $("#advcrmsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advcrmsg").addClass("alert alert-danger")
    })
}

function AdvPaAcc(){
    if($("#advpanaz").val() == "" && $("#advpaname").val() == "" && $("#advpayear").val() == "" && $("#advparez").val() == "" && $("#advparoz").val() == "" && $("#advpaim").val() == "" && !$("#sorpa1").is(':checked') && !$("#sorpa2").is(':checked') && !$("#sorpa3").is(':checked') && !$("#sorpa4").is(':checked') && !$("#sorpa5").is(':checked') && !$("#sorpa6").is(':checked')){
        HideAdvPa()
        return
    }
    var query_string2 = query_string
    var ifwhere = false
    if($("#advpanaz").val() != ""){
        query_string2 = query_string2 + ' where ' + globnaz3 + ' = "' + $("#advpanaz").val() + '"'
        ifwhere = true
    }
    if($("#advpaim").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where ' + globim1 + ' = "' + $("#advpaim").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and ' + globim1 + ' = "' + $("#advpaim").val() + '"'
        }
    }
    if($("#advpaname").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where u.turniej_nazwa = "' + $("#advpaname").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and u.turniej_nazwa = "' + $("#advpaname").val() + '"'
        }
    }
    if($("#advpayear").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where u.turniej_rok = ' + $("#advpayear").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and u.turniej_rok = ' + $("#advpayear").val() 
        }
    }
    if($("#advparez").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where u.rezultat = "' + $("#advparez").val() + '"'
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and u.rezultat = "' + $("#advparez").val() + '"'
        }
    }
    if($("#advparoz").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where coalesce(rozstawienie, "brak") = ' + $("#advparoz").val()
            ifwhere = true
        }
        else{
            query_string2 = query_string2 + ' and coalesce(rozstawienie, "brak") = ' + $("#advparoz").val() 
        }
    }
    var ord = false
    if($("#sorpa1").is(':checked')){
        query_string2 = query_string2 + ' order by turniej_rok desc'
        ord = true
    }
    if($("#sorpa2").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by turniej_rok asc'
            ord = true
        }
        else{
            $("#advpamsg").text("Należy sortować według jednego elementu.")
            $("#advpamsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpa3").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by liczba_zdobytych_punktów desc'
            ord = true
        }
        else{
            $("#advpamsg").text("Należy sortować według jednego elementu.")
            $("#advpamsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpa4").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by liczba_zdobytych_punktów asc'
            ord = true
        }
        else{
            $("#advpamsg").text("Należy sortować według jednego elementu.")
            $("#advpamsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpa5").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by rozstawienie asc'
            ord = true
        }
        else{
            $("#advpamsg").text("Należy sortować według jednego elementu.")
            $("#advpamsg").addClass("alert alert-danger")
            return
        }
    }
    if($("#sorpa6").is(':checked')){
        if(ord == false){
            query_string2 = query_string2 + ' order by rozstawienie desc'
            ord = true
        }
        else{
            $("#advpamsg").text("Należy sortować według jednego elementu.")
            $("#advpamsg").addClass("alert alert-danger")
            return
        }
    }
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        var res_str = ""
        for(var i = 0; i < response.data.length; i++){
            res_str = res_str + response.data[i].imie + ' ' + response.data[i].nazwisko + ' ' + response.data[i].turniej_nazwa + ' ' + response.data[i].turniej_rok + ' '
            if(response.data[i].rezultat != undefined){
                res_str = res_str + response.data[i].rezultat + ' ' 
            }
            if(response.data[i].liczba_zdobytych_punktów != undefined){
                res_str = res_str + response.data[i].liczba_zdobytych_punktów + ' '
            }
            if(response.data[i].rozst != undefined){
                res_str = res_str + response.data[i].rozst + ' '
            }
            res_str = res_str + '\n'
        }
        $("#resultsmsg").text(res_str)
        HideAdvPa()
    })
    .catch(function (error){
        $("#advpamsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advpamsg").addClass("alert alert-danger")
    })
}

function AdvPaAcc2(){
    var res_str = ""
    if($("#advpanaz").val() == "" || $("#advpaname").val() == "" || $("#advpayear").val() == ""){
        $("#advpamsg").text("Należy podać nazwisko zawodnika, nazwę oraz rok turnieju.")
        $("#advpamsg").addClass("alert alert-danger")
        return
    }
    var query_string2 = 'select tournament_singles_result((select id_gracza from zawodnik where nazwisko = "' + $("#advpanaz").val() + '" and imie = "' + $("#advpaim").val() + '"), "' + $("#advpaname").val() + '", ' + $("#advpayear").val() + ') as rez'
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        if(response.data[0].rez != null){
            res_str = "Turniej singlowy: " + response.data[0].rez
        }
    })
    .catch(function (error){
        $("#advpamsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advpamsg").addClass("alert alert-danger")
    })
    query_string2 = 'select tournament_doubles_result((select id_gracza from zawodnik where nazwisko = "' + $("#advpanaz").val() + '" and imie = "' + $("#advpaim").val() + '"), "' + $("#advpaname").val() + '", ' + $("#advpayear").val() + ') as rez'
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        if(response.data[0].rez != null){
            res_str = res_str + " " + "Turniej deblowy:" + response.data[0].rez
        }
        $("#resultsmsg").text(res_str)
        HideAdvPa()
    })
    .catch(function (error){
        $("#advpamsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advpamsg").addClass("alert alert-danger")
    })
}

function HideAdvMat(){
    $("#Results").show()
    $("#AdvMat").hide()
    $("#advmatmsg").text("")
    $("#advmatmsg").removeClass("alert alert-danger")
}

function AdvMatAcc(){
    var query_string2 = query_string
    var ifwhere = false
    if($("#advmatnaz").val() == "" && $("#advmatname").val() == "" && $("#advmatyear").val() == "" && $("#advmatdat").val() == "" && $("#advmatnaz2").val() == "" && !$("#sormat1").is(':checked') && !$("#sormat2").is(':checked')){
        HideAdvMat()
        return
    }
    if($("#advmatnaz").val() == "" && $("#advmatnaz2").val() != ""){
        $("#advmatmsg").text("Proszę wypełnić pole z nazwiskiem pierwszego zawodnika.")
        $("#advmatmsg").addClass("alert alert-danger")
        return
    }
    if($("#sormat1").is(':checked') && $("#sormat2").is(':checked')){
        $("#advmatmsg").text("Nie można sortować jednocześnie od najstarszych i najnowszych.")
        $("#advmatmsg").addClass("alert alert-danger")
        return
    }
    if($("#advmatnaz").val() != "" && $("#advmatnaz2").val() == ""){
        query_string2 = query_string2 + ' where (' + globnaz1 + ' = "' + $("#advmatnaz").val() + '" or ' + globnaz2 + ' = "' + $("#advmatnaz").val() + '")'
        ifwhere = true
    }
    if($("#advmatnaz").val() != "" && $("#advmatnaz2").val() != ""){
        query_string2 = query_string2 + ' where ((' + globnaz1 + ' = "' + $("#advmatnaz").val() + '" or ' + globnaz2 + ' = "' + $("#advmatnaz").val() + '") and (' + globnaz1 + ' = "' + $("#advmatnaz2").val() + '" or ' + globnaz2 + ' = "' + $("#advmatnaz2").val() + '"))'
        ifwhere = true
    }
    if($("#advmatname").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where m.turniej_nazwa = "' + $("#advmatname").val() + '"'
        }
        else{
            query_string2 = query_string2 + ' and m.turniej_nazwa = "' + $("#advmatname").val() + '"'
        }
    }
    if($("#advmatdat").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where m.data_meczu = "' + $("#advmatdat").val() + '"'
        }
        else{
            query_string2 = query_string2 + ' and m.data_meczu = "' + $("#advmatdat").val() + '"'
        }
    }
    if($("#advmatyear").val() != ""){
        if(ifwhere == false){
            query_string2 = query_string2 + ' where extract(year from m.data_meczu) = ' + $("#advmatyear").val() 
        }
        else{
            query_string2 = query_string2 + ' and extract(year from m.data_meczu) = ' + $("#advmatyear").val()
        }
    }
    if($("#sormat1").is(':checked')){
        query_string2 = query_string2 + ' order by m.data_meczu desc'
    }
    if($("#sormat2").is(':checked')){
        query_string2 = query_string2 + ' order by m.data_meczu asc'
    }
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        var res_str = ""
        for(var i = 0; i < response.data.length; i++){
            if(response.data[i].data_meczu != undefined){
                res_str = res_str + response.data[i].data_meczu + ' ' 
            }
            res_str = res_str + response.data[i].imie1 + ' ' + response.data[i].nazwisko1 + ' ' + response.data[i].imie2 + ' ' + response.data[i].nazwisko2 + ' ' + response.data[i].wynik + ' '
            if(response.data[i].turniej_nazwa != undefined){
                res_str = res_str + response.data[i].turniej_nazwa + ' '
            }
            if(response.data[i].etap_turnieju != undefined){
                res_str = res_str + response.data[i].etap_turnieju + ' '
            }
            res_str = res_str + '\n'
        }
        $("#resultsmsg").text(res_str)
        HideAdvMat()
    })
    .catch(function (error){
        $("#advmatmsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advmatmsg").addClass("alert alert-danger")
    })
}

function AdvRankAcc(){
    var x
    if($("#advrankod").val() == ""){
        $("#advrankod").val("0")
    }
    else{
        var pom = $("#advrankod").val()
        pom = parseInt(pom)
        pom = pom - 1
        var v = true
        if(pom < 0){
            var v = false
        }
        x = pom
        $("#advrankod").val(pom.toString())
        if($("#advrankod").val() == "NaN" || v == false){
            $("#advrankmsg").text("Proszę podać wartość liczbową większą od 0")
            $("#advrankmsg").addClass("alert alert-danger")
            $("#advrankod").val("")
            $("#advrankdo").val("")
            return
        }
    }
    if($("#advrankdo").val() == ""){
        var r_do = "1000"
    }
    else{
        var pom = $("#advrankdo").val()
        pom = parseInt(pom)
        var v = true
        if(pom < 0 || pom <= x){
            var v = false
        }
        $("#advrankdo").val(pom.toString())
        if($("#advrankdo").val() == "NaN" || v == false){
            $("#advrankmsg").text("Proszę podać wartość liczbową większą od 0. Wartość 'do' powinna być większa od wartości 'od'")
            $("#advrankmsg").addClass("alert alert-danger")
            $("#advrankdo").val("")
            $("#advrankod").val("")
            return
        }
        var r_do = $("#advrankdo").val()
    }
    var query_string2 = query_string
    if($("#sorran1").is(':checked')){
        query_string2 = query_string2 + ' desc'
    }
    query_string2 = query_string2 + ' limit ' + $("#advrankod").val() + ', ' + r_do
    axios.post('/results',{
        query_str: query_string2   
    })
    .then(function (response){
        var res_str = ""
        for(var i = 0; i < response.data.length; i++){
            res_str = res_str + response.data[i].pozycja + '. ' + response.data[i].imie + ' ' + response.data[i].nazwisko + ' '
            if(response.data[i].punkty_singlowe != undefined){
                res_str = res_str + response.data[i].punkty_singlowe + '\n'
            }
            else{
                res_str = res_str + response.data[i].punkty_deblowe + '\n'
            }
        }
        $("#resultsmsg").text(res_str)
        HideAdvRank()
    })
    .catch(function (error){
        $("#advrankmsg").text("Podczas wyszukiwania wystąpił błąd.")
        $("#advrankmsg").addClass("alert alert-danger")
    })
}

function ShowResults(){
    var licznik = 0
    query_string = 'SELECT '
    $("#findpropmsg").text("") 
    if($("#sinmm").is(':checked') || $("#sinkk").is(':checked') || $("#debkk").is(':checked') || $("#debmm").is(':checked')){
        if($("#sinmm").is(':checked')){
            licznik++
            query_string = query_string + 'pozycja, imie, nazwisko, punkty_singlowe from pozycja inner join zawodnik on pozycja.zawodnik_id_gracza = zawodnik.id_gracza where data_do is null' + 
            ' and ranking_rodzaj_rankingu = "singlowy mężczyzn" order by pozycja' 
        }
        if($("#sinkk").is(':checked')){
            licznik++
            query_string = query_string + 'pozycja, imie, nazwisko, punkty_singlowe from pozycja inner join zawodnik on pozycja.zawodnik_id_gracza = zawodnik.id_gracza where data_do is null' + 
            ' and ranking_rodzaj_rankingu = "singlowy kobiet" order by pozycja' 
        }
        if($("#debkk").is(':checked')){
            licznik++
            query_string = query_string + 'pozycja, imie, nazwisko, punkty_deblowe from pozycja inner join zawodnik on pozycja.zawodnik_id_gracza = zawodnik.id_gracza where data_do is null' + 
            ' and ranking_rodzaj_rankingu = "deblowy kobiet" order by pozycja' 
        }
        if($("#debmm").is(':checked')){
            licznik++
            query_string = query_string + 'pozycja, imie, nazwisko, punkty_deblowe from pozycja inner join zawodnik on pozycja.zawodnik_id_gracza = zawodnik.id_gracza where data_do is null' + 
            ' and ranking_rodzaj_rankingu = "deblowy mężczyzn" order by pozycja' 
        }
        if(licznik != 1){
            $("#findpropmsg").text("Można wyszukać maksymalnie jeden ranking na raz.")
            $("#findpropmsg").addClass("alert alert-danger")
            return
        }
        axios.post('/results',{
            query_str: query_string   
        })
        .then(function (response){
            var res_str = ""
            for(var i = 0; i < response.data.length; i++){
                res_str = res_str + response.data[i].pozycja + '. ' + response.data[i].imie + ' ' + response.data[i].nazwisko + ' '
                if(response.data[i].punkty_singlowe != undefined){
                    res_str = res_str + response.data[i].punkty_singlowe + '\n'
                }
                else{
                    res_str = res_str + response.data[i].punkty_deblowe + '\n'
                }
            }
            $("#resultsmsg").text(res_str)
            $("#FindProp").hide()
            $("#Results").show()
            tab = "ranking"
        })
        .catch(function (error){
            $("#findpropmsg").text("Podczas wyszukiwania wystąpił błąd.")
            $("#findpropmsg").addClass("alert alert-danger")
        })
    }
    else if($("#rolaa").is(':checked') || $("#zakk").is(':checked') || $("#rozpp").is(':checked') || $("#zaww").is(':checked')){
        query_string = query_string + 'sztab.imie as imie_sztab, sztab.nazwisko as nazwisko_sztab'
        var zaw = false
        if($("#rolaa").is(':checked')){
            query_string = query_string + ', rola'
        }
        if($("#rozpp").is(':checked')){
            query_string = query_string + ', data_rozpoczęcia'
        }
        if($("#zakk").is(':checked')){
            query_string = query_string + ', data_zakończenia'
        }
        if($("#zaww").is(':checked')){
            query_string = query_string + ', zawodnik.imie as imie_zawodnik, zawodnik.nazwisko as nazwisko_zawodnik'
            zaw = true
        }
        query_string = query_string + ' from wspolpraca right outer join sztab on wspolpraca.sztab_id_członka_sztabu = sztab.id_członka_sztabu '
        if(zaw == true){
            query_string = query_string + 'left outer join zawodnik on wspolpraca.zawodnik_id_gracza = zawodnik.id_gracza'
        }
        axios.post('/results',{
            query_str: query_string   
        })
        .then(function (response){
            var res_str = ""
            for(var i = 0; i < response.data.length; i++){
                res_str = res_str + response.data[i].imie_sztab + ' ' + response.data[i].nazwisko_sztab + ' '
                if(response.data[i].rola != undefined){
                    res_str = res_str + response.data[i].rola + ' ' 
                }
                if(response.data[i].imie_zawodnik != undefined){
                    res_str = res_str + response.data[i].imie_zawodnik + ' ' + response.data[i].nazwisko_zawodnik + ' '
                }
                if(response.data[i].data_rozpoczęcia != undefined){
                    console.log(response.data[i].data_rozpoczęcia)
                    res_str = res_str + response.data[i].data_rozpoczęcia + ' '
                }
                if(response.data[i].data_zakończenia != undefined){
                    res_str = res_str + response.data[i].data_zakończenia + ' '
                }
                res_str = res_str + '\n'
            }
            $("#resultsmsg").text(res_str)
            $("#FindProp").hide()
            $("#Results").show()
            tab = "sztab"
        })
        .catch(function (error){
            $("#findpropmsg").text("Podczas wyszukiwania wystąpił błąd.")
            $("#findpropmsg").addClass("alert alert-danger")
        })
    }
    else if($("#datt").is(':checked') || $("#turr").is(':checked') || $("#etaa").is(':checked')){
        query_string = query_string + 'wynik, (select distinct imie from udzial inner join mecz on udzial.id_udzialu = mecz.udzial_id_udzialu1 inner join zawodnik on udzial.zawodnik_id_gracza = '+
        'zawodnik.id_gracza where m.udzial_id_udzialu1 = mecz.udzial_id_udzialu1) as imie1, (select distinct nazwisko from udzial inner join mecz on udzial.id_udzialu = mecz.udzial_id_udzialu1 inner join zawodnik on udzial.zawodnik_id_gracza = ' + 
        'zawodnik.id_gracza where m.udzial_id_udzialu1 = mecz.udzial_id_udzialu1) as nazwisko1, (select distinct nazwisko from udzial inner join mecz on udzial.id_udzialu = mecz.udzial_id_udzialu2 inner join zawodnik on udzial.zawodnik_id_gracza = ' +
        'zawodnik.id_gracza where m.udzial_id_udzialu2 = mecz.udzial_id_udzialu2) as nazwisko2, (select distinct imie from udzial inner join mecz on udzial.id_udzialu = mecz.udzial_id_udzialu2 inner join zawodnik on udzial.zawodnik_id_gracza = ' +
        'zawodnik.id_gracza where m.udzial_id_udzialu2 = mecz.udzial_id_udzialu2) as imie2'
        if($("#datt").is(':checked')){
            query_string = query_string + ', data_meczu'
        }
        if($("#turr").is(':checked')){
            query_string = query_string + ', turniej_nazwa'
        }
        if($("#etaa").is(':checked')){
            query_string = query_string + ', etap_turnieju'
        }
        query_string = query_string + ' from mecz m'
        axios.post('/results',{
            query_str: query_string   
        })
        .then(function (response){
            var res_str = ""
            for(var i = 0; i < response.data.length; i++){
                if(response.data[i].data_meczu != undefined){
                    res_str = res_str + response.data[i].data_meczu + ' ' 
                }
                res_str = res_str + response.data[i].imie1 + ' ' + response.data[i].nazwisko1 + ' ' + response.data[i].imie2 + ' ' + response.data[i].nazwisko2 + ' ' + response.data[i].wynik + ' '
                if(response.data[i].turniej_nazwa != undefined){
                    res_str = res_str + response.data[i].turniej_nazwa + ' '
                }
                if(response.data[i].etap_turnieju != undefined){
                    res_str = res_str + response.data[i].etap_turnieju + ' '
                }
                res_str = res_str + '\n'
            }
            $("#resultsmsg").text(res_str)
            $("#FindProp").hide()
            $("#Results").show()
            tab = "mecz"
        })
        .catch(function (error){
            $("#findpropmsg").text("Podczas wyszukiwania wystąpił błąd.")
            $("#findpropmsg").addClass("alert alert-danger")
        })
    }
    else if($("#narodd").is(':checked') || $("#urodzz").is(':checked') || $("#wzrostt").is(':checked') || $("#rekaa").is(':checked') || $("#sinrann").is(':checked') || $("#debrann").is(':checked')){
        query_string = query_string + 'imie, nazwisko'
        if($("#narodd").is(':checked')){
            query_string = query_string + ', narodowość'
        }
        if($("#urodzz").is(':checked')){
            query_string = query_string + ', data_urodzenia'
        }
        if($("#wzrostt").is(':checked')){
            query_string = query_string + ', wzrost'
        }
        if($("#rekaa").is(':checked')){
            query_string = query_string + ', preferowana_ręka'
        }
        if($("#sinrann").is(':checked')){
            query_string = query_string + ', punkty_singlowe, (select pozycja from pozycja inner join zawodnik on pozycja.zawodnik_id_gracza = zawodnik.id_gracza ' + 
            'where ((płeć = "kobieta" and ranking_rodzaj_rankingu = "singlowy kobiet") or (płeć = "mężczyzna" and ranking_rodzaj_rankingu = "singlowy mężczyzn")) and z.id_gracza = zawodnik.id_gracza) as poz1'
        }
        if($("#debrann").is(':checked')){
            query_string = query_string + ', punkty_deblowe, (select pozycja from pozycja inner join zawodnik on pozycja.zawodnik_id_gracza = zawodnik.id_gracza ' + 
            'where ((płeć = "kobieta" and ranking_rodzaj_rankingu = "deblowy kobiet") or (płeć = "mężczyzna" and ranking_rodzaj_rankingu = "deblowy mężczyzn")) and z.id_gracza = zawodnik.id_gracza) as poz2'
        }
        query_string = query_string + ' from zawodnik z'
        axios.post('/results',{
            query_str: query_string   
        })
        .then(function (response){
            var res_str = ""
            for(var i = 0; i < response.data.length; i++){
                res_str = res_str + response.data[i].imie + ' ' + response.data[i].nazwisko + ' '
                if(response.data[i].narodowość != undefined){
                    res_str = res_str + response.data[i].narodowość + ' ' 
                }
                if(response.data[i].data_urodzenia!= undefined){
                    res_str = res_str + response.data[i].data_urodzenia + ' '
                }
                if(response.data[i].wzrost != undefined){
                    res_str = res_str + response.data[i].wzrost + ' '
                }
                if(response.data[i].preferowana_ręka != undefined){
                    res_str = res_str + response.data[i].preferowana_ręka + ' '
                }
                if(response.data[i].punkty_singlowe != undefined){
                    res_str = res_str + response.data[i].punkty_singlowe + ' ' + response.data[i].poz1 + ' '
                }
                if(response.data[i].punkty_deblowe != undefined){
                    res_str = res_str + response.data[i].punkty_deblowe + ' ' + response.data[i].poz2 + ' '
                }
                res_str = res_str + '\n'
            }
            $("#resultsmsg").text(res_str)
            $("#FindProp").hide()
            $("#Results").show()
            tab = "zawodnik"
        })
        .catch(function (error){
            $("#findpropmsg").text("Podczas wyszukiwania wystąpił błąd.")
            $("#findpropmsg").addClass("alert alert-danger")
        })
    }
    else if($("#rann").is(':checked') || $("#naww").is(':checked') || $("#miaa").is(':checked') || $("#pull").is(':checked') || $("#poczz").is(':checked') || $("#konn").is(':checked') || $("#kraa").is(':checked')){
        query_string = query_string + 'nazwa, rok'
        if($("#rann").is(':checked')){
            query_string = query_string + ', ranga'
        }
        if($("#naww").is(':checked')){
            query_string = query_string + ', nawierzchnia'
        }
        if($("#miaa").is(':checked')){
            query_string = query_string + ', miasto'
        }
        if($("#pull").is(':checked')){
            query_string = query_string + ', pula_nagród'
        }
        if($("#poczz").is(':checked')){
            query_string = query_string + ', data_rozpoczęcia'
        }
        if($("#konn").is(':checked')){
            query_string = query_string + ', data_zakończenia'
        }
        if($("#kraa").is(':checked')){
            query_string = query_string + ', kraj'
        }
        query_string = query_string + ' from turniej'
        axios.post('/results',{
            query_str: query_string   
        })
        .then(function (response){
            var res_str = ""
            for(var i = 0; i < response.data.length; i++){
                res_str = res_str + response.data[i].nazwa + ' ' + response.data[i].rok + ' '
                if(response.data[i].ranga != undefined){
                    res_str = res_str + response.data[i].ranga + ' ' 
                }
                if(response.data[i].nawierzchnia != undefined){
                    res_str = res_str + response.data[i].nawierzchnia + ' '
                }
                if(response.data[i].miasto != undefined){
                    res_str = res_str + response.data[i].miasto + ' '
                }
                if(response.data[i].kraj != undefined){
                    res_str = res_str + response.data[i].kraj + ' '
                }
                if(response.data[i].pula_nagród != undefined){
                    res_str = res_str + response.data[i].pula_nagród + ' '
                }
                if(response.data[i].data_rozpoczęcia != undefined){
                    res_str = res_str + response.data[i].data_rozpoczęcia + ' ' 
                }
                if(response.data[i].data_zakończenia != undefined){
                    res_str = res_str + response.data[i].data_zakończenia + ' '
                }
                res_str = res_str + '\n'
            }
            $("#resultsmsg").text(res_str)
            $("#FindProp").hide()
            $("#Results").show()
            tab = "turniej"
        })
        .catch(function (error){
            $("#findpropmsg").text("Podczas wyszukiwania wystąpił błąd.")
            $("#findpropmsg").addClass("alert alert-danger")
        })
    }
    else if($("#rozstaa").is(':checked') || $("#rezz").is(':checked') || $("#licc").is(':checked')){
        query_string = query_string + 'turniej_nazwa, turniej_rok, (select imie from zawodnik inner join udzial on zawodnik.id_gracza = udzial.zawodnik_id_gracza where ' + 
        'udzial.zawodnik_id_gracza = u.zawodnik_id_gracza) as imie, (select nazwisko from zawodnik inner join udzial on zawodnik.id_gracza = udzial.zawodnik_id_gracza where ' + 
        'udzial.zawodnik_id_gracza = u.zawodnik_id_gracza) as nazwisko'
        if($("#rezz").is(':checked')){
            query_string = query_string + ', rezultat'
        }
        if($("#licc").is(':checked')){
            query_string = query_string + ', liczba_zdobytych_punktów'
        }
        if($("#rozstaa").is(':checked')){
            query_string = query_string + ', coalesce(rozstawienie, "brak") as rozst'
        }
        query_string = query_string + ' from udzial u'
        axios.post('/results',{
            query_str: query_string   
        })
        .then(function (response){
            var res_str = ""
            for(var i = 0; i < response.data.length; i++){
                res_str = res_str + response.data[i].imie + ' ' + response.data[i].nazwisko + ' ' + response.data[i].turniej_nazwa + ' ' + response.data[i].turniej_rok + ' '
                if(response.data[i].rezultat != undefined){
                    res_str = res_str + response.data[i].rezultat + ' ' 
                }
                if(response.data[i].liczba_zdobytych_punktów != undefined){
                    res_str = res_str + response.data[i].liczba_zdobytych_punktów + ' '
                }
                if(response.data[i].rozst != undefined){
                    res_str = res_str + response.data[i].rozst + ' '
                }
                res_str = res_str + '\n'
            }
            $("#resultsmsg").text(res_str)
            $("#FindProp").hide()
            $("#Results").show()
            tab = "udzial"
        })
        .catch(function (error){
            $("#findpropmsg").text("Podczas wyszukiwania wystąpił błąd.")
            $("#findpropmsg").addClass("alert alert-danger")
        })
    }
    else{
        $("#findpropmsg").text("Należy zaznaczyć przynajmniej jeden element.")
        $("#findpropmsg").addClass("alert alert-danger")
        return
    }
}

function HideResults(){
    $("#FindProp").show()
    $("#Results").hide() 
    $("#advtoname").val("")
    $("#advtoyear").val("")
    $("#advtoran").val("")
    $("#advtonaw").val("")
    $("#advtomia").val("")
    $("#advtokra").val("")
    $("#advtopul1").val("")
    $("#advplim").val("")
    $("#advplnaz").val("")
    $("#advplnar").val("")
    $("#advplpl").val("")
    $("#advplwzr1").val("")
    $("#advplwzr2").val("")
    $("#advplyear").val("")
    $("#advplhan").val("")
    $("#advtopul2").val("")
    $("#advrankod").val("")
    $("#advrankdo").val("")
    $("#advcrim").val("")
    $("#advcrnaz").val("")
    $("#advcrim2").val("")
    $("#advcrnaz2").val("")
    $("#advcrrol").val("")
    $("#advpanaz").val("")
    $("#advpaname").val("")
    $("#advpayear").val("")
    $("#advparez").val("")
    $("#advparoz").val("")
    $("#advmatnaz").val("")
    $("#advmatname").val("")
    $("#advmatyear").val("")
    $("#advmatdat").val("")
    $("#advmatnaz2").val("")
}

function ShowModOpt(){
    $("#Startowy").hide()
    $("#ModOpt").show()
}

function ShowDelCr(){
    $("#DelCr").show()
    $("#ChooseActionCr").hide()
}

function ShowInsCr(){
    $("#InsCr").show()
    $("#ChooseActionCr").hide()
}

function ShowDelPa(){
    $("#DelPa").show()
    $("#ChooseActionPa").hide()
}

function ShowInsPa(){
    $("#InsPa").show()
    $("#ChooseActionPa").hide()
}

function ShowDelTo(){
    $("#DelTo").show()
    $("#ChooseActionTo").hide()
}

function ShowDelPl(){
    $("#DelPl").show()
    $("#ChooseActionPl").hide()
}

function ShowModPl(){
    $("#ModPl").show()
    $("#ChooseActionPl").hide()
}

function ShowModPa(){
    $("#ModPa").show()
    $("#ChooseActionPa").hide()
}

function ShowModCr(){
    $("#ModCr").show()
    $("#ChooseActionCr").hide()
}

function ShowModTo(){
    $("#ModTo").show()
    $("#ChooseActionTo").hide()
}


function ShowDelMa(){
    $("#DelMa").show()
    $("#ChooseActionMa").hide()
}

function ShowInsPl(){
    $("#InsPl").show()
    $("#ChooseActionPl").hide()
}

function ShowInsTo(){
    $("#InsTo").show()
    $("#ChooseActionTo").hide()
}

function ShowInsMa(){
    $("#InsMa").show()
    $("#ChooseActionMa").hide()
}

function HideDelCr(){
    $("#DelCr").hide()
    $("#ChooseActionCr").show()
    $("#delcrmsg").text("")
    $("#delcrmsg").removeClass()
    $("#namecr").val("")
    $("#lastcr").val("")
}

function HideModCr(){
    $("#ModCr").hide()
    $("#ChooseActionCr").show()
    $("#modcrmsg").text("")
    $("#modcrmsg").removeClass()
    $("#namemodcr").val("")
    $("#lastmodcr").val("")
    $("#namemodcr2").val("")
    $("#lastmodcr2").val("")
    $("#rolamodcr").val("")
    $("#datmodcr").val("")
    $("#datmodcr2").val("")
}

function HideInsCr(){
    $("#InsCr").hide()
    $("#ChooseActionCr").show()
    $("#inscrmsg").text("")
    $("#inscrmsg").removeClass()
    $("#nameincr").val("")
    $("#lastincr").val("")
    $("#rolaincr").val("")
}

function HideModTo(){
    $("#ModTo").hide()
    $("#ChooseActionTo").show()
    $("#modtomsg").text("")
    $("#modtomsg").removeClass()
    $("#namemodto").val("")
    $("#yearmodto").val("")
    $("#datmodto").val("")
}

function HideModPa(){
    $("#ModPa").hide()
    $("#ChooseActionPa").show()
    $("#modpamsg").text("")
    $("#modpamsg").removeClass()
    $("#namemodpa").val("")
    $("#lastmodpa").val("")
    $("#namemodpa2").val("")
    $("#lastmodpa2").val("")
    $("#tyearmodpa").val("")
    $("#tnamemodpa").val("")
}

function HideInsPl(){
    $("#InsPl").hide()
    $("#ChooseActionPl").show()
    $("#insplmsg").text("")
    $("#insplmsg").removeClass()
    $("#nameinpl").val("")
    $("#lastinpl").val("")
    $("#natinpl").val("")
    $("#datinpl").val("")
    $("#heiinpl").val("")
    $("#geninpl").val("")
    $("#haninpl").val("")
}

function HideInsTo(){
    $("#InsTo").hide()
    $("#ChooseActionTo").show()
    $("#instomsg").text("")
    $("#instomsg").removeClass()
    $("#nameinto").val("")
    $("#yearinto").val("")
    $("#raninto").val("")
    $("#surinto").val("")
    $("#citinto").val("")
    $("#couinto").val("")
    $("#priinto").val("")
    $("#datinto").val("")
    $("#datinto2").val("")
}

function HideInsMa(){
    $("#InsMa").hide()
    $("#ChooseActionMa").show()
    $("#insmamsg").text("")
    $("#insmamsg").removeClass()
    $("#nameinsma").val("")
    $("#lastinsma").val("")
    $("#nameinsma2").val("")
    $("#lastinsma2").val("")
    $("#datainsma").val("")
    $("#sdinsma").val("")
    $("#etainsma").val("")
    $("#resinsma").val("")
    $("#tnameinsma").val("")
    $("#yearinsma").val("")

}

function HideModPl(){
    $("#ModPl").hide()
    $("#ChooseActionPl").show()
    $("#modplmsg").text("")
    $("#modplmsg").removeClass()
    $("#namemodpl").val("")
    $("#lastmodpl").val("")
    $("#natmodpl").val("")
    $("#heimodpl").val("")
    $("#hanmodpl").val("")
    $("#namemodpl2").val("")
    $("#lastmodpl2").val("")
}

function ModTo(){
    if($("#namemodto").val() == "" || $("#yearmodto").val() == "" || $("#datmodto").val() == ""){
        $("#modtomsg").text("Wszystkie pola muszą być wypełnione.")
        $("#modtomsg").addClass("alert alert-danger")
        return
    }
    axios.post('/modto',{
        nazwa: $("#namemodto").val(),
        rok: $("#yearmodto").val(),
        dat: $("#datmodto").val()
    })
    .then(function (response){
        $("#modtomsg").text(response.data)
        $("#modtomsg").removeClass("alert alert-danger")
        $("#modtomsg").addClass("alert alert-success")
        $("#namemodto").val("")
        $("#yearmodto").val("")
        $("#datmodto").val("")
    })
    .catch(function (error){
        $("#modtomsg").text(error.response.data)
        $("#modtomsg").removeClass("alert alert-success")
        $("#modtomsg").addClass("alert alert-danger")
    })
}

function ModCr(){
    if($("#namemodcr").val() == "" || $("#lastmodcr").val() == "" || $("#namemodcr2").val() == "" || $("#lastmodcr2").val() == "" || $("#rolaodcr").val() == "" || $("#datmodcr").val() == ""){
        $("#modtomsg").text("Wszystkie obowiązkowe pola muszą być wypełnione.")
        $("#modtomsg").addClass("alert alert-danger")
        return
    }
    axios.post('/modcr',{
        imie: $("#namemodcr").val(),
        nazwisko: $("#lastmodcr").val(),
        imie2: $("#namemodcr2").val(),
        nazwisko2: $("#lastmodcr2").val(),
        rola: $("#rolamodcr").val(),
        dat: $("#datmodcr").val()
        
    })
    .then(function (response){
        $("#modcrmsg").text(response.data)
        $("#modcrmsg").removeClass("alert alert-danger")
        $("#modcrmsg").addClass("alert alert-success")
        $("#namemodcr").val("")
        $("#lastmodcr").val("")
        $("#namemodcr2").val("")
        $("#lastmodcr2").val("")
        $("#rolamodcr").val("")
        $("#datmodcr").val("")
        $("#datmodcr2").val("")
    })
    .catch(function (error){
        $("#modcrmsg").text(error.response.data)
        $("#modcrmsg").removeClass("alert alert-success")
        $("#modcrmsg").addClass("alert alert-danger")
    })
}

function ModCr2(){
    if($("#namemodcr").val() == "" || $("#lastmodcr").val() == "" || $("#namemodcr2").val() == "" || $("#lastmodcr2").val() == "" || $("#datmodcr2").val() == ""){
        $("#modtomsg").text("Wszystkie obowiązkowe pola muszą być wypełnione.")
        $("#modtomsg").addClass("alert alert-danger")
        return
    }
    axios.post('/modcr2',{
        imie: $("#namemodcr").val(),
        nazwisko: $("#lastmodcr").val(),
        imie2: $("#namemodcr2").val(),
        nazwisko2: $("#lastmodcr2").val(),
        dat: $("#datmodcr2").val()    
    })
    .then(function (response){
        $("#modcrmsg").text(response.data)
        $("#modcrmsg").removeClass("alert alert-danger")
        $("#modcrmsg").addClass("alert alert-success")
        $("#namemodcr").val("")
        $("#lastmodcr").val("")
        $("#namemodcr2").val("")
        $("#lastmodcr2").val("")
        $("#rolamodcr").val("")
        $("#datmodcr").val("")
        $("#datmodcr2").val("")
    })
    .catch(function (error){
        $("#modcrmsg").text(error.response.data)
        $("#modcrmsg").removeClass("alert alert-success")
        $("#modcrmsg").addClass("alert alert-danger")
    })
}

function ModPl(){
    if($("#namemodpl2").val() == "" || $("#lastmodpl2").val() == ""){
        $("#modplmsg").text("Pola ze starym imieniem i nazwiskiem muszą być wypełnione.")
        $("#modplmsg").addClass("alert alert-danger")
        return
    }
    if($("#namemodpl").val() == "" && $("#lastmodpl").val() == "" && $("#natmodpl").val() == "" && $("#heimodpl").val() == "" && $("#hanmodpl").val() == ""){
        $("#modplmsg").text("Przynajmniej jedno pole z nowymi wartościami musi być wypełnione.")
        $("#modplmsg").addClass("alert alert-danger")
        return
    }
    if($("#hanmodpl").val() != "lewa" && $("#hanmodpl").val() != "prawa" && $("#hanmodpl").val() != "obie" && $("#hanmodpl").val() != ""){
        $("#modplmsg").text("Preferowaną ręką zawodnika może być jedynie 'lewa', 'prawa' lub 'obie'")
        $("#modplmsg").addClass("alert alert-danger")
        return
    }
    if($("#namemodpl").val().length > 30 || $("#lastmodpl").val().length > 30 || $("#natmodpl").val().length > 30){
        $("#modplmsg").text("Długość imienia, nazwiska oraz narodowości nie może przekraczać 30 znaków")
        $("#modplmsg").addClass("alert alert-danger")
        return
    }
    axios.post('/modpl',{
        imie: $("#namemodpl").val(),
        nazwisko: $("#lastmodpl").val(),
        kraj: $("#natmodpl").val(),
        wzrost: $("#heimodpl").val(),
        imie2: $("#namemodpl2").val(),
        nazwisko2: $("#lastmodpl2").val(),
        reka: $("#hanmodpl").val()
    })
    .then(function (response){
        $("#modplmsg").text(response.data)
        $("#modplmsg").removeClass("alert alert-danger")
        $("#modplmsg").addClass("alert alert-success")
        $("#namemodpl").val("")
        $("#lastmodpl").val("")
        $("#natmodpl").val("")
        $("#heimodpl").val("")
        $("#hanmodpl").val("")
        $("#namemodpl2").val("")
        $("#lastmodpl2").val("")
    })
    .catch(function (error){
        $("#modplmsg").text(error.response.data)
        $("#modplmsg").removeClass("alert alert-success")
        $("#modplmsg").addClass("alert alert-danger")
    })
}

function InsPl(){
    if($("#nameinpl").val() == "" || $("#lastinpl").val() == "" || $("#natinpl").val() == "" || $("#datinpl").val() == "" || $("#heiinpl").val() == "" || $("#geninpl").val() == "" || $("#haninpl").val() == ""){
        $("#insplmsg").text("Wszystkie pola muszą być wypełnione")
        $("#insplmsg").addClass("alert alert-danger")
        return
    }
    if($("#geninpl").val() != "kobieta" && $("#geninpl").val() != "mężczyzna"){
        $("#insplmsg").text("Płcią zawodnika może być jedynie kobieta lub mężczyzna")
        $("#insplmsg").addClass("alert alert-danger")
        return
    }
    if($("#haninpl").val() != "lewa" && $("#haninpl").val() != "prawa" && $("#haninpl").val() != "obie"){
        $("#insplmsg").text("Preferowaną ręką zawodnika może być jedynie 'lewa', 'prawa' lub 'obie'")
        $("#insplmsg").addClass("alert alert-danger")
        return
    }
    if($("#nameinpl").val().length > 30 || $("#lastinpl").val().length > 30 || $("#natinpl").val().length > 30){
        $("#insplmsg").text("Długość imienia, nazwiska oraz narodowości nie może przekraczać 30 znaków")
        $("#insplmsg").addClass("alert alert-danger")
        return
    }
    if(parseInt($("#heiinpl").val()) < 140){
        $("#insplmsg").text("Zawodnik musi mieć co najmniej 140cm wzrostu")
        $("#insplmsg").addClass("alert alert-danger")
        return
    }
    axios.post('/inspl',{
        imie: $("#nameinpl").val(),
        nazwisko: $("#lastinpl").val(),
        kraj: $("#natinpl").val(),
        dat: $("#datinpl").val(),
        wzrost: $("#heiinpl").val(),
        plec: $("#geninpl").val(),
        reka: $("#haninpl").val()
    })
    .then(function (response){
        $("#insplmsg").text(response.data)
        $("#insplmsg").removeClass("alert alert-danger")
        $("#insplmsg").addClass("alert alert-success")
        $("#nameinpl").val("")
        $("#lastinpl").val("")
        $("#natinpl").val("")
        $("#datinpl").val("")
        $("#heiinpl").val("")
        $("#geninpl").val("")
        $("#haninpl").val("")
    })
    .catch(function (error){
        $("#insplmsg").text(error.response.data)
        $("#insplmsg").removeClass("alert alert-success")
        $("#insplmsg").addClass("alert alert-danger")
    })
}

function HideDelTo(){
    $("#DelTo").hide()
    $("#ChooseActionTo").show()
    $("#deltomsg").text("")
    $("#deltomsg").removeClass()
    $("#nameto").val("")
    $("#yearto").val("")
}

function HideDelPl(){
    $("#DelPl").hide()
    $("#ChooseActionPl").show()
    $("#deplmsg").text("")
    $("#delplmsg").removeClass()
    $("#namepl").val("")
    $("#lastpl").val("")
}

function HideDelPa(){
    $("#DelPa").hide()
    $("#ChooseActionPa").show()
    $("#delpamsg").text("")
    $("#delpamsg").removeClass()
    $("#namepa").val("")
    $("#lastpa").val("")
    $("#tnamepa").val("")
    $("#lastpa").val("")
}

function HideInsPa(){
    $("#InsPa").hide()
    $("#ChooseActionPa").show()
    $("#inspamsg").text("")
    $("#inspamsg").removeClass()
    $("#nameinpa").val("")
    $("#lastinpa").val("")
    $("#tnameinpa").val("")
    $("#tyearinpa").val("")
    $("#rezinpa").val("")
    $("#numinpa").val("")
    $("#rozinpa").val("")
    $("#sindeb").val("")
}

function HideDelMa(){
    $("#DelMa").hide()
    $("#ChooseActionMa").show()
    $("#delmamsg").text("")
    $("#delmamsg").removeClass()
    $("#namema").val("")
    $("#lastma").val("")
    $("#datama").val("")
    $("#sdma").val("")
}

function DelCr(){
    if($("#namecr").val() == "" || $("#lastcr").val() == ""){
        $("#delcrmsg").text("Wszystkie pola muszą być wypełnione")
        $("#delcrmsg").addClass("alert alert-danger")
        return
    }
    axios.post('/delcr',{
        imie: $("#namecr").val(),
        nazwisko: $("#lastcr").val()
    })
    .then(function (response){
        $("#delcrmsg").text(response.data)
        $("#delcrmsg").removeClass("alert alert-danger")
        $("#delcrmsg").addClass("alert alert-success")
        $("#namecr").val("")
        $("#lastcr").val("")
    })
    .catch(function (error){
        $("#delcrmsg").text(error.response.data)
        $("#delcrmsg").removeClass("alert alert-success")
        $("#delcrmsg").addClass("alert alert-danger")
    })
}

function InsCr(){
    if($("#nameincr").val() == "" || $("#lastincr").val() == "" || $("#rolaincr").val() == ""){
        $("#inscrmsg").text("Wszystkie pola muszą być wypełnione")
        $("#inscrmsg").addClass("alert alert-danger")
        return
    }
    axios.post('/inscr',{
        imie: $("#nameincr").val(),
        nazwisko: $("#lastincr").val(),
        rola: $("#rolaincr").val() 
    })
    .then(function (response){
        $("#inscrmsg").text(response.data)
        $("#inscrmsg").removeClass("alert alert-danger")
        $("#inscrmsg").addClass("alert alert-success")
        $("#nameincr").val("")
        $("#lastincr").val("")
        $("#rolaincr").val("") 
    })
    .catch(function (error){
        $("#inscrmsg").text(error.response.data)
        $("#inscrmsg").removeClass("alert alert-success")
        $("#inscrmsg").addClass("alert alert-danger")
    })
}

function DelTo(){
    if($("#nameto").val() == ""){
        $("#deltomsg").text("Pole nazwa musi być wypełnione")
        $("#deltomsg").addClass("alert alert-danger")
        return
    }
    axios.post('/delto',{
        nazwa: $("#nameto").val(),
        rok: $("#yearto").val()
    })
    .then(function (response){
        $("#deltomsg").text(response.data)
        $("#deltomsg").removeClass("alert alert-danger")
        $("#deltomsg").addClass("alert alert-success")
        $("#nameto").val("")
        $("#yearto").val("")
    })
    .catch(function (error){
        $("#deltomsg").text(error.response.data)
        $("#deltomsg").removeClass("alert alert-success")
        $("#deltomsg").addClass("alert alert-danger")
    })
}

function InsTo(){
    if($("#raninto").val() != "Wielki Szlem" && $("#raninto").val() != "Masters 1000" && $("#raninto").val() != "Masters 500" && $("#raninto").val() != "Masters 250" && $("#raninto").val() != "Challenger" && $("#raninto").val() != "ITF"){
        $("#instomsg").text("Podano błędną rangę turnieju")
        $("#instomsg").addClass("alert alert-danger")
        return
    }
    if(parseInt($("#priinto").val()) < 0){
        $("#instomsg").text("Pula nagród musi być większa od 0")
        $("#instomsg").addClass("alert alert-danger")
        return
    }
    var data1 = $("#datinto").val()
    var data2 = $("#datinto2").val()
    if($("#datinto2").val() != ""){
        for(var i = 0; i < data1.length; i++){
            if(data1[i] > data2[i]){
                $("#instomsg").text("Data zakończenia musi być późniejsza niż data rozpoczęcia")
                $("#instomsg").addClass("alert alert-danger")
                return
            }
        }
    }
    var data3 = $("#datinto").val().slice(0,4)
    if($("#yearinto").val() != data3){
        $("#instomsg").text("Rok turnieju musi być równy rokowi daty początkowej.")
        $("#instomsg").addClass("alert alert-danger")
        return
    }
    if(parseInt($("#priinto").val()) < 0){
        $("#instomsg").text("Pula nagród musi być większa od 0.")
        $("#instomsg").addClass("alert alert-danger")
        return
    }
    if($("#raninto").val() == "" || $("#nameinto").val() == "" || $("#yearinto").val() == "" || $("#surinto").val() == "" || $("#citinto").val() == "" || $("#couinto").val() == "" || $("#priinto").val() == "" || $("#datinto").val() == ""){
        $("#instomsg").text("Obowiązkowe pola muszą zostać wypełnione")
        $("#instomsg").addClass("alert alert-danger")
        return
    }
    if($("#surinto").val() != "trawa" && $("#surinto").val() != "mączka" && $("#surinto").val() != "twardy" && $("#surinto").val() != "indoor"){
        $("#instomsg").text("Podano niewłaściwą nazwę nawierzchni.")
        $("#instomsg").addClass("alert alert-danger")
        return
    }
    axios.post('/insto',{
        nazwa: $("#nameinto").val(),
        rok: $("#yearinto").val(),
        ranga: $("#raninto").val(),
        naw: $("#surinto").val(),
        miasto: $("#citinto").val(),
        kraj: $("#couinto").val(),
        pula: $("#priinto").val(),
        data1: $("#datinto").val(),
        data2: $("#datinto2").val()
    })
    .then(function (response){
        $("#instomsg").text(response.data)
        $("#instomsg").removeClass("alert alert-danger")
        $("#instomsg").addClass("alert alert-success")
        $("#nameinto").val("")
        $("#yearinto").val("")
        $("#raninto").val("")
        $("#surinto").val("")
        $("#citinto").val("")
        $("#couinto").val("")
        $("#priinto").val("")
        $("#datinto").val("")
        $("#datinto2").val("")
    })
    .catch(function (error){
        $("#instomsg").text(error.response.data)
        $("#instomsg").removeClass("alert alert-success")
        $("#instomsg").addClass("alert alert-danger")
    })
}

function DelPl(){
    if($("#namepl").val() == "" || $("#lastpl").val() == ""){
        $("#delplmsg").text("Wszystkie pola muszą być wypełnione")
        $("#delplmsg").addClass("alert alert-danger")
        return
    }
    axios.post('/delpl',{
        imie: $("#namepl").val(),
        nazwisko: $("#lastpl").val()
    })
    .then(function (response){
        $("#delplmsg").text(response.data)
        $("#delplmsg").removeClass("alert alert-danger")
        $("#delplmsg").addClass("alert alert-success")
        $("#namepl").val("")
        $("#lastpl").val("")
    })
    .catch(function (error){
        $("#delplmsg").text(error.response.data)
        $("#delplmsg").removeClass("alert alert-success")
        $("#delplmsg").addClass("alert alert-danger")
    })
}

function ModPa(){
    if($("#namemodpa").val() == "" || $("#lastmodpa").val() == "" || $("#tnamemodpa").val() == "" || $("#tyearmodpa").val() == "" || $("#lastmodpa2").val() == "" || $("#namemodpa2").val() == ""){
        $("#modpamsg").text("Obowiązkowe pola muszą być wypełnione")
        $("#modpamsg").addClass("alert alert-danger")
        return
    }
    axios.post('/modpa',{
        imie: $("#namemodpa").val(),
        nazwisko: $("#lastmodpa").val(),
        imie2: $("#namemodpa2").val(),
        nazwisko2: $("#lastmodpa2").val(),
        rok: $("#tyearmodpa").val(),
        nazwa: $("#tnamemodpa").val()
    })
    .then(function (response){
        $("#modpamsg").text(response.data)
        $("#modpamsg").removeClass("alert alert-danger")
        $("#modpamsg").addClass("alert alert-success")
        $("#namemodpa").val("")
        $("#lastmodpa").val("")
        $("#namemodpa2").val("")
        $("#lastmodpa2").val("")
        $("#tyearmodpa").val("")
        $("#tnamemodpa").val("")
    })
    .catch(function (error){
        $("#modpamsg").text(error.response.data)
        $("#modpamsg").removeClass("alert alert-success")
        $("#modpamsg").addClass("alert alert-danger")
    })
}

function InsPa(){
    if($("#nameinpa").val() == "" || $("#lastinpa").val() == "" || $("#tnameinpa").val() == "" || $("#tyearinpa").val() == "" || $("#rezinpa").val() == "" || $("#numinpa").val() == "" || $("#sindeb").val() == ""){
        $("#inspamsg").text("Obowiązkowe pola muszą być wypełnione")
        $("#inspamsg").addClass("alert alert-danger")
        return
    }
    if($("#rezinpa").val() != "1/64" && $("#rezinpa").val() != "1/32" && $("#rezinpa").val() != "Q" && $("#rezinpa").val() != "1/16" && $("#rezinpa").val() != "1/8" && $("#rezinpa").val() != "QF" && $("#rezinpa").val() != "SF" && $("#rezinpa").val() != "F" && $("#rezinpa").val() != "W"){
        $("#inspamsg").text("Podano nieprawidłowy rezultat zawodnika w turnieju.")
        $("#inspamsg").addClass("alert alert-danger")
        return
    }
    if($("#sindeb").val() != "singlowy" && $("#sindeb").val() != "deblowy"){
        $("#inspamsg").text("Udział może być jedynie singlowy lub deblowy.")
        $("#inspamsg").addClass("alert alert-danger")
        return
    }
    if(parseInt($("#numinpa").val()) < 0 || $("#rozinpa").val() < 1){
        $("#inspamsg").text("Liczba punktów nie może być mniejsza od 0, a rozstawienie mniejsze od 1.")
        $("#inspamsg").addClass("alert alert-danger")
        return
    }
    axios.post('/inspa',{
        imie: $("#nameinpa").val(),
        nazwisko: $("#lastinpa").val(),
        nazwa: $("#tnameinpa").val(),
        rok: $("#tyearinpa").val(),
        rez: $("#rezinpa").val(),
        punkty: $("#numinpa").val(),
        roz: $("#rozinpa").val(),
        sindeb: $("#sindeb").val()
    })
    .then(function (response){
        $("#inspamsg").text(response.data)
        $("#inspamsg").removeClass("alert alert-danger")
        $("#inspamsg").addClass("alert alert-success")
        $("#nameinpa").val("")
        $("#lastinpa").val("")
        $("#tnameinpa").val("")
        $("#tyearinpa").val("")
        $("#rezinpa").val("")
        $("#numinpa").val("")
        $("#rozinpa").val("")
        $("#sindeb").val("")
    })
    .catch(function (error){
        $("#inspamsg").text(error.response.data)
        $("#inspamsg").removeClass("alert alert-success")
        $("#inspamsg").addClass("alert alert-danger")
    })
}

function DelPa(){
    if($("#namepa").val() == "" || $("#lastpa").val() == ""){
        $("#delpamsg").text("Pola imię i nazwisko muszą być wypełnione")
        $("#delpamsg").addClass("alert alert-danger")
        return
    }
    axios.post('/delpa',{
        imie: $("#namepa").val(),
        nazwisko: $("#lastpa").val(),
        nazwa: $("#tnamepa").val(),
        rok: $("#tyearpa").val()
    })
    .then(function (response){
        $("#delpamsg").text(response.data)
        $("#delpamsg").removeClass("alert alert-danger")
        $("#delpamsg").addClass("alert alert-success")
        $("#namepa").val("")
        $("#lastpa").val("")
        $("#tnamepa").val("")
        $("#lastpa").val("")
    })
    .catch(function (error){
        $("#delpamsg").text(error.response.data)
        $("#delpamsg").removeClass("alert alert-success")
        $("#delpamsg").addClass("alert alert-danger")
    })
}

function InsMa(){
    if($("#nameinsma").val() == "" || $("#lastinsma").val() == "" || $("#nameinsma2").val() == "" || $("#lastinsma2").val() == "" || $("#datainsma").val() == "" || $("#sdinsma").val() == "" || $("#tnameinsma").val() == "" || $("#yearinsma").val() == "" || $("#etainsma").val() == "" || $("#resinsma").val() == ""){
        $("#insmamsg").text("Wszystkie pola muszą być wypełnione")
        $("#insmamsg").addClass("alert alert-danger")
        return
    }
    if($("#sdinsma").val() != "singlowy" && $("#sdinsma").val() != "deblowy"){
        $("#insmamsg").text("Zawartość pola singlowy/deblowy jest nieprawidłowa.")
        $("#insmamsg").addClass("alert alert-danger")
        return
    }
    if($("#etainsma").val() != "1/64" && $("#etainsma").val() != "1/32" && $("#etainsma").val() != "Q" && $("#etainsma").val() != "1/16" && $("#etainsma").val() != "1/8" && $("#etainsma").val() != "QF" && $("#etainsma").val() != "SF" && $("#etainsma").val() != "F"){
        $("#insmamsg").text("Podano nieprawidłowy etap turnieju.")
        $("#insmamsg").addClass("alert alert-danger")
        return
    }
    axios.post('/insma',{
        imie: $("#nameinsma").val(),
        nazwisko: $("#lastinsma").val(),
        imie2: $("#nameinsma2").val(),
        nazwisko2: $("#lastinsma2").val(),
        dat: $("#datainsma").val(),
        sindeb: $("#sdinsma").val(),
        nazwa: $("#tnameinsma").val(),
        rok: $("#yearinsma").val(),
        etap: $("#etainsma").val(),
        wynik: $("#resinsma").val()
    })
    .then(function (response){
        $("#insmamsg").text(response.data)
        $("#insmamsg").removeClass("alert alert-danger")
        $("#insmamsg").addClass("alert alert-success")
        $("#nameinsma").val("")
        $("#lastinsma").val("")
        $("#nameinsma2").val("")
        $("#lastinsma2").val("")
        $("#datainsma").val("")
        $("#sdinsma").val("")
        $("#etainsma").val("")
        $("#resinsma").val("")
        $("#tnameinsma").val("")
        $("#yearinsma").val("")
    })
    .catch(function (error){
        $("#insmamsg").text(error.response.data)
        $("#insmamsg").removeClass("alert alert-success")
        $("#insmamsg").addClass("alert alert-danger")
    })
}

function DelMa(){
    if($("#namema").val() == "" || $("#lastma").val() == ""){
        $("#delmamsg").text("Pola imię i nazwisko muszą być wypełnione")
        $("#delmamsg").addClass("alert alert-danger")
        return
    }
    if($("#sdma").val() != "singlowy" && $("#sdma").val() != "deblowy" && $("#sdma").val() != ""){
        $("#delmamsg").text("Zawartość pola singlowy/deblowy jest nieprawdiłowa.")
        $("#delmamsg").addClass("alert alert-danger")
    }
    axios.post('/delma',{
        imie: $("#namema").val(),
        nazwisko: $("#lastma").val(),
        dat: $("#datama").val(),
        sindeb: $("#sdma").val()
    })
    .then(function (response){
        $("#delmamsg").text(response.data)
        $("#delmamsg").removeClass("alert alert-danger")
        $("#delmamsg").addClass("alert alert-success")
        $("#namema").val("")
        $("#lastma").val("")
        $("#datama").val("")
        $("#sdma").val("")
    })
    .catch(function (error){
        $("#delmamsg").text(error.response.data)
        $("#delmamsg").removeClass("alert alert-success")
        $("#delmamsg").addClass("alert alert-danger")
    })
}

function ShowFindOpt() {
    $("#Startowy").hide()
    $("#FindOpt").show()
}

function HideFindOpt() {
    $("#FindOpt").hide()
    $("#Startowy").show()  
}

function HideModOpt() {
    $("#ModOpt").hide()
    $("#Startowy").show()
}

function HideFindProp() {
    $("#FindOpt").show()
    $("#FindProp").hide()
    $("#findpropmsg").text("")
    $("#findpropmsg").removeClass("alert alert-danger")
    $('input[type=checkbox]').prop('checked',false);
}

function ShowRankFind(){
    $("#FindOpt").hide()
    $("#FindProp").show()
    $("#narod").hide()
    $("#urodz").hide()
    $("#wzrost").hide()
    $("#reka").hide()
    $("#sinran").hide()
    $("#debran").hide()
    $("#sink").show()
    $("#sinm").show()
    $("#debk").show()
    $("#debm").show()
    $("#rola").hide()
    $("#rozp").hide()
    $("#zak").hide()
    $("#zaw").hide()
    $("#dat").hide()
    $("#tur").hide()
    $("#eta").hide()
    $("#ran").hide()
    $("#mia").hide()
    $("#naw").hide()
    $("#pul").hide()
    $("#pocz").hide()
    $("#kon").hide()
    $("#kra").hide()
    $("#rozsta").hide()
    $("#rez").hide()
    $("#lic").hide()
}

function ShowPlayFind(){
    $("#FindOpt").hide()
    $("#FindProp").show()
    $("#narod").show()
    $("#urodz").show()
    $("#wzrost").show()
    $("#reka").show()
    $("#sinran").show()
    $("#debran").show()
    $("#sink").hide()
    $("#sinm").hide()
    $("#debk").hide()
    $("#debm").hide()
    $("#rola").hide()
    $("#rozp").hide()
    $("#zak").hide()
    $("#zaw").hide()
    $("#dat").hide()
    $("#tur").hide()
    $("#eta").hide()
    $("#ran").hide()
    $("#mia").hide()
    $("#naw").hide()
    $("#pul").hide()
    $("#pocz").hide()
    $("#kon").hide()
    $("#kra").hide()
    $("#rozsta").hide()
    $("#rez").hide()
    $("#lic").hide()
}

function ShowCrewFind(){
    $("#FindOpt").hide()
    $("#FindProp").show()
    $("#narod").hide()
    $("#urodz").hide()
    $("#wzrost").hide()
    $("#reka").hide()
    $("#sinran").hide()
    $("#debran").hide()
    $("#sink").hide()
    $("#sinm").hide()
    $("#debk").hide()
    $("#debm").hide()
    $("#rola").show()
    $("#rozp").show()
    $("#zak").show()
    $("#zaw").show()
    $("#dat").hide()
    $("#tur").hide()
    $("#eta").hide()
    $("#ran").hide()
    $("#mia").hide()
    $("#naw").hide()
    $("#pul").hide()
    $("#pocz").hide()
    $("#kon").hide()
    $("#kra").hide()
    $("#rozsta").hide()
    $("#rez").hide()
    $("#lic").hide()
}

function ShowMatchFind(){
    $("#FindOpt").hide()
    $("#FindProp").show()
    $("#narod").hide()
    $("#urodz").hide()
    $("#wzrost").hide()
    $("#reka").hide()
    $("#sinran").hide()
    $("#debran").hide()
    $("#sink").hide()
    $("#sinm").hide()
    $("#debk").hide()
    $("#debm").hide()
    $("#rola").hide()
    $("#rozp").hide()
    $("#zak").hide()
    $("#zaw").hide()
    $("#dat").show()
    $("#tur").show()
    $("#eta").show()
    $("#ran").hide()
    $("#mia").hide()
    $("#naw").hide()
    $("#pul").hide()
    $("#pocz").hide()
    $("#kon").hide()
    $("#kra").hide()
    $("#rozsta").hide()
    $("#rez").hide()
    $("#lic").hide()
}

function ShowPartFind(){
    $("#FindOpt").hide()
    $("#FindProp").show()
    $("#narod").hide()
    $("#urodz").hide()
    $("#wzrost").hide()
    $("#reka").hide()
    $("#sinran").hide()
    $("#debran").hide()
    $("#sink").hide()
    $("#sinm").hide()
    $("#debk").hide()
    $("#debm").hide()
    $("#rola").hide()
    $("#rozp").hide()
    $("#zak").hide()
    $("#zaw").hide()
    $("#dat").hide()
    $("#tur").hide()
    $("#eta").hide()
    $("#ran").hide()
    $("#mia").hide()
    $("#naw").hide()
    $("#pul").hide()
    $("#pocz").hide()
    $("#kon").hide()
    $("#kra").hide()
    $("#rozsta").show()
    $("#rez").show()
    $("#lic").show()
}


function ShowTourFind(){
    $("#FindOpt").hide()
    $("#FindProp").show()
    $("#narod").hide()
    $("#urodz").hide()
    $("#wzrost").hide()
    $("#reka").hide()
    $("#sinran").hide()
    $("#debran").hide()
    $("#sink").hide()
    $("#sinm").hide()
    $("#debk").hide()
    $("#debm").hide()
    $("#rola").hide()
    $("#rozp").hide()
    $("#zak").hide()
    $("#zaw").hide()
    $("#dat").hide()
    $("#tur").hide()
    $("#eta").hide()
    $("#ran").show()
    $("#mia").show()
    $("#naw").show()
    $("#pul").show()
    $("#pocz").show()
    $("#kon").show()
    $("#kra").show()
    $("#rozsta").hide()
    $("#rez").hide()
    $("#lic").hide()
}

function ShowPlayModOpt(){
    $("#ModOpt").hide()
    $("#ChooseActionPl").show()
}

function ShowTourModOpt(){
    $("#ModOpt").hide()
    $("#ChooseActionTo").show()
}

function ShowCrewModOpt(){
    $("#ModOpt").hide()
    $("#ChooseActionCr").show()
}

function ShowPartModOpt(){
    $("#ModOpt").hide()
    $("#ChooseActionPa").show()
}

function ShowMatchModOpt(){
    $("#ModOpt").hide()
    $("#ChooseActionMa").show()
}

function HideCAPl(){
    $("#ModOpt").show()
    $("#ChooseActionPl").hide()
}

function HideCAPa(){
    $("#ModOpt").show()
    $("#ChooseActionPa").hide()
}

function HideCATo(){
    $("#ModOpt").show()
    $("#ChooseActionTo").hide()
}

function HideCAMa(){
    $("#ModOpt").show()
    $("#ChooseActionMa").hide()
}

function HideCACr(){
    $("#ModOpt").show()
    $("#ChooseActionCr").hide()
}