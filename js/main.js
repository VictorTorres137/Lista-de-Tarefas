
const Main = {

    tasks:[],

    init: function(){
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
        console.log(this.tasks)
        
    },

    cacheSelectors: function(){
       this.$checkButtons = document.querySelectorAll('.check')
       this.$inputTask = document.querySelector('#inputTask')
       this.$list = document.querySelector('#list')
       this.$removeButtons = document.querySelectorAll('.remove')
       
    },

    bindEvents: function(){
        const self = this
        
        this.$checkButtons.forEach(function(button){ //para cada item em checkButtons faz a função determinada
            button.onclick = self.Events.checkButton_click
           
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)
        this.$removeButtons.forEach(function(button){
            button.onclick = self.Events.removeButton_click.bind(self)
        })

    },

    getStoraged: function(){
        const tasks = localStorage.getItem('tasks')
        // console.log(tasks)
        this.tasks = JSON.parse(tasks)
    },

    getTaskHtml: function(task, pronto=false){
        
        let donetrue = ""

        if (pronto){
            donetrue = 'class="done"'
        }

        return `
                <li ${donetrue}>
                    <div class="check"></div>
                    <label class="task">
                        ${task} 
                    </label>
                    <button class="remove" data-task="${task}"></button>
                </li>
                `
    },

    buildTasks: function(){
        let html = ''
        if (localStorage.getItem('tasks')){
            this.tasks.forEach(item => {
                console.log(item.task)
                html += this.getTaskHtml(item.task, item.done)
                    
            })
            this.$list.innerHTML = html

            this.cacheSelectors()
            this.bindEvents()
        }
    },
    
    Events: {

        checkButton_click: function(e){
            const li = e.target.parentElement
            
            const isDone = li.classList.contains('done')
            let novoPronto = JSON.parse(localStorage.getItem('tasks'))

            if (!isDone){
                li.classList.add('done')
                
                for (item of novoPronto){
                    // console.log(`${item.task} === ${li.children[1].innerHTML.trim()}`)
                    
                    if (item.task === li.children[1].innerHTML.trim()){

                        
                        item.done = true
                        
                        // console.log(novoPronto[0].done)
                        
                        
                    }
                }

                

                localStorage.setItem('tasks', JSON.stringify(novoPronto))

                return
            }
            for (item of novoPronto){
                // console.log(`${item.task} === ${li.children[1].innerHTML.trim()}`)
                
                if (item.task === li.children[1].innerHTML.trim()){
                    item.done = false
                }
            }
            li.classList.remove('done')

            localStorage.setItem('tasks', JSON.stringify(novoPronto))
        },

        inputTask_keypress: function(e){
            const key = e.key
            const value = e.target.value
            
            
            if(key === "Enter"){
                this.$list.innerHTML += this.getTaskHtml(value)
                e.target.value = ''
                
                

                this.cacheSelectors()
                this.bindEvents()
                


                if (localStorage.getItem('tasks')){
                    const savedTasks = localStorage.getItem('tasks')
                    const savedTasksObj = JSON.parse(savedTasks)
    
                    const obj =[
                        { task: value, done: false},
                        ...savedTasksObj,
                    ]
    
                    localStorage.setItem('tasks', JSON.stringify(obj))
                } else{
                    const obj =[
                        { task: value, done: false}
                        
                    ]
    
                    localStorage.setItem('tasks', JSON.stringify(obj))
                }
                this.getStoraged()
            }
        },

        removeButton_click: function(e){
            const li = e.target.parentElement //parentElement Procura o Pai da Tag
            const value = e.target.dataset['task']
            

            const newTasksState = this.tasks.filter(item => item.task !== value && !li.classList.contains("removed"))

            console.log(`${JSON.stringify(newTasksState)} = newTaskState`)

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            this.getStoraged()

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
                
            },300)
        }

    }
}

Main.init()

