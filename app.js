// THIS IS HOW TO SET A NUMBER OF CONTENT FOR YOUR TABLE
// (optional)
Table.content = 10
// --------------------------

// THIS IS HOW TO ADD ADDITIONAL OPTIONS ON REQUEST
// (optional)
Table.options = {
    method : "GET",
    headers : {
        'Content-type' : "application/json",
        'token' : 'your token'
    }
}
// ---------------------------

Table.Load({
    thead : ["firstname","Lastname","Email","-"],
    API : 'http://127.0.0.1:3001/api/admin/cp/pending?page={page}&range={items}',
    total : 10,
    format : (d) => {
        const res = d.data
        let temp = ''
    
        for(const i in res){
            temp += `
            <tr>
                <td>${res[i].firstname}</td>
                <td>${res[i].lastname}</td>
                <td>${res[i].email}</td>
                <td><button class="btn btn-outline-primary btn-sm">view</button></td>
            </tr>
            `
        }
        document.querySelector('tbody').innerHTML = temp
    }
})