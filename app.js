Table.Load({
    thead : ["ID","Email","Date","-"],
    API : 'https://url.com?page={page}&search={search}&items={items}',
    total : 105,
    format : (data) => {
        let temp = ''
    
        for(const i in data){
            temp += `DO SOMETHING HERE`
        }

        document.querySelector('tbody').innerHTML = temp
    }
})