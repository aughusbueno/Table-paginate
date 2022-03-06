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
        this.tbody = {}
    }
    page(_page = 1)
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
        // https://url.com?page={page}&search={pageEnd} // Backend : accepts only page number and search
        // https://url.com?skip={pageStart}&limit={items} // Backend : skips number of items and Limit items display

        console.log(`From item ${pageStart} to ${pageEnd}`)
        this.GenerateButtons()
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
        let navigation = []

        const prev = 'Previous'
        const next = 'Next'

        const half = Math.floor(this.visibleButtons / 2)
        const currentPage = this.pageNum

        const low = currentPage - half
        const high = currentPage + half

        const pagesToShow = Array.from({length: this.visibleButtons}, (v, i) => i + low)

        navigation = [prev, ...pagesToShow, next]

        console.log(navigation)
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
                    <select class="form-control form-control-sm d-inline">
                        <option value="15" ${this.content == 15 && 'selected'}>15</option>
                        <option value="20" ${this.content == 20 && 'selected'}>20</option>
                        <option value="25" ${this.content == 25 && 'selected'}>25</option>
                        <option value="30" ${this.content == 30 && 'selected'}>25</option>
                    </select>
                </span>
                <span>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" placeholder="Search">
                        <button class="input-group-text btn btn-primary">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </span>
            </div>
        </div>
        `

        document.querySelector('.Table-header-container').innerHTML = temp
    }
    GenerateThead()
    {
        let temp = ''
        let content = ''
        
        this.thead.map(e => content += `<th class="text-primary">${e}</th>`)

        temp += `
        <thead>
            <tr>
                ${content}
            </tr>
        </thead>
        `

        document.querySelector('.Table-contents-container').innerHTML = temp
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
    Load()
    {
        const table = document.querySelector('#table')
        table.innerHTML = '' //remove soon

        table.innerHTML += `
        <div class="Table-header-container">
        </div>
        <div class="w-100 overflow-auto p-3 shadow-sm rounded bg-light">
            <table class="table w-100 table-bordered m-0 Table-contents-container">
            </table>
        </div>
        <div class="d-flex justify-content-end align-items-center mt-3 Table-navigation-container">
        </div>
        `
        
        this.GenerateTop()
        this.GenerateThead()
        this.GenerateButtons()

    }
}

const Table = new Paginate()