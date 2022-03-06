class Paginate {
    constructor()
    {
        this.content = 15
        this.total = null
        this.pageNum = 1
        this.visibleButtons = 5

        this.search = null // search
        this.API = null // Your api
        this.options = { // default options for fetch function
            method : "GET"
        }

        // TABLE CONTENTS SETTINGS
        this.thead = []
        this.format = null
    }
    async page(_page = 1)
    {
        if(!this.total) return console.error("please set total items.")
        if((this.visibleButtons % 2) != 1) return console.error("visibleButtons : Only odd numbers accepted.")

        const items = this.content

        const page = _page
        this.pageNum = page

        const pageStart = ((page - 1) * items) + 1
        const pageEnd = (page * items) > this.total ? this.total : (page * items)
        const search = this.search || ""

        // POSSIBLE QUERY PARAMETERS :
        // https://url.com?start={pageStart}&end={pageEnd}&search={search} // Backend : Select... Limit 1,15
        // https://url.com?page={page}&search={search} // Backend : accepts only page number and search
        // https://url.com?skip={pageStart}&limit={items}&search={search} // Backend : skips number of items and Limit items display

        try{
            let url = this.API.replaceAll('{pageStart}',pageStart)
                            .replaceAll('{pageEnd}',pageEnd)
                            .replaceAll('{search}',search)
                            .replaceAll('{page}',page)
                            .replaceAll('{items}',items)

            // const data = await fetch(url, this.options)
            // const json = await data.json()

            // const d = await json

            this.GenerateButtons()
            console.log(url)
            return console.log(`From item ${pageStart} to ${pageEnd}. ${ search && ('Search : '+search)}`)

            if(typeof this.format == 'function'){
                return this.format(d)
            }

        }
        catch(error){
            alert(error)
        }
    }
    getTotalPage()
    {
        if(!this.total) return console.error("please set total items.")
        if((this.visibleButtons % 2) != 1) return console.error("visibleButtons : Only odd numbers accepted.")

        const total = this.total
        const items = this.content

        const totalPage = (total/items).toFixed()

        return parseInt(totalPage)
    }
    pageNavigation()
    {
        let prev = this.pageNum != 1 ? 'Previous' : ''
        let next = this.getTotalPage() > this.pageNum ? 'Next' : ''

        const totalPage = parseInt(this.getTotalPage())
        const half = Math.floor(this.visibleButtons / 2)
        const currentPage = parseInt(this.pageNum)

        let high = currentPage + half
        let low = currentPage - half
        
        if(high >= totalPage) low = low - (high - totalPage)

        if(low <= 1) low = 1

        const pagesToShow = Array.from({length: this.visibleButtons}, (v, i) => i + low)
        .filter(i => i >= 1 && i <= totalPage)

        let navigation = [prev, ...pagesToShow, next]

        // console.log(navigation)
        return navigation
    }

    // ****************************************
    // GENERATE TABLE COMPONENTS
    // ****************************************
    GenerateTop()
    {
        let temp = ''

        temp += `
        <div class="bg-light p-3 shadow-sm rounded mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <span class="d-flex align-items-center">
                    <select class="form-control form-control-sm d-inline Table-contents">
                        <option value="15" ${this.content == 15 && 'selected'}>15</option>
                        <option value="20" ${this.content == 20 && 'selected'}>20</option>
                        <option value="25" ${this.content == 25 && 'selected'}>25</option>
                        <option value="30" ${this.content == 30 && 'selected'}>30</option>
                    </select>
                </span>
                <span>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control Table-search-input" placeholder="Search" value="${this.search || ''}">
                        <button class="input-group-text btn btn-primary Table-search-btn">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </span>
            </div>
        </div>
        `

        document.querySelector('.Table-header-container').innerHTML = temp

        let set = (num) =>  this.content = num
        let search = (string) =>  this.search = string
        const load = () =>  this.Reload()

        document.querySelector('.Table-contents').addEventListener('change', (e) => {
            set(parseInt(e.target.value))
            load()
        })
        
        document.querySelector('.Table-search-btn').addEventListener('click', (e) => {
            search(document.querySelector('.Table-search-input').value)
            load()
        })
    }
    GenerateThead()
    {
        let content = ''
        
        this.thead.map(e => content += `<th class="text-primary">${e}</th>`)

        document.querySelector('.Table-contents-container thead').innerHTML = `<tr>${content}</tr>`
    }
    GenerateButtons()
    {
        let temp = ''

        this.pageNavigation().filter(i => i != '').map(item => {
            let page = 0

            if(typeof item == 'number'){
                page = item
            }
            else{
                page = item == 'Previous' ? parseInt(this.pageNum) - 1 : parseInt(this.pageNum) + 1 
            }

            return temp += `
            <button data-page-number="${page}" class="btn btn-sm ${item == this.pageNum ? 'btn-primary' : 'btn-light'} m-1 shadow-sm">
                ${item}
            </button>
            `
        })

        document.querySelector('.Table-navigation-container').innerHTML = temp

        const method = (_i) => this.page(_i)

        document.querySelectorAll('[data-page-number]').forEach(each => {
            each.addEventListener('click', evt => method(each.dataset.pageNumber))
        })
    }
    Load(settings)
    {
        if(settings){
            this.API = settings.API
            this.thead = settings.thead
            this.format = settings.format || null
            this.total = settings.total
        }

        if(!this.API) return console.error("Please set an API")
        if(!this.thead) return console.error("Please set a table header")

        if(typeof this.thead != 'object') console.error("Table header should be type of array")
        
        const table = document.querySelector('#table')

        table.innerHTML = `
        <div class="Table-header-container">
        </div>
        <div class="w-100 overflow-auto p-3 shadow-sm rounded bg-light">
            <table class="table w-100 table-bordered m-0 Table-contents-container">
                <thead>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-end align-items-center mt-3 Table-navigation-container">
        </div>
        `
        
        this.GenerateTop()
        this.GenerateThead()
        this.GenerateButtons()
        this.page()
    }
    Reload()
    {
        this.GenerateButtons()
        this.page()
    }
}

const Table = new Paginate()