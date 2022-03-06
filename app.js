Table.thead = ["ID","Email","Date","-"]
Table.API = 'https://url.com?page={page}&search={search}'
Table.total = 105 // Ito gusto kong mabago haha!
Table.Load()

Table.format = (data) => {
    // DATA PARAMETER IS THE RESULT FROM YOUR API
    let temp = ''

    for(const i in data){
        temp += `DO SOMETHING HERE`
    }

    document.querySelector('tbody').innerHTML = temp
}