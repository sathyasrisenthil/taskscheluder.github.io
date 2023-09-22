class Task {
    constructor(taskName, dueDate, priority) {
       this.taskName = taskName;
        this.dueDate = dueDate;

        this.priority = priority;
        this.completed = false;
    }
    getTaskDetail() {
        return `${this.taskName} (Due: ${this.dueDate}, Priority:
${this.priority})`;
    }
    toggleCompletion() {
        this.completed = !this.completed;
    }
}
let taskList = [];
function addTask(...tasks) {
    taskList.push(...tasks);
}
function deleteLastTask() {
    taskList.pop();
}
function addTaskToFront(...tasks) {
    taskList.unshift(...tasks);
}
function deleteFirstTask() {
    taskList.shift();
}
function TaskOperations() {
    let totalTasks = 0;
    return {
        getTotalTasks: () =&gt; totalTasks,
        addTask: (task) =&gt; {
            totalTasks++;
            addTask(task);
        },
        deleteTask: (taskName) =&gt; {
            const index = taskList.findIndex(task =&gt; task.taskName ===
taskName);
            if (index !== -1) {
                totalTasks--;
                taskList.splice(index, 1);
            }
        }

    };
}
const taskOperations = TaskOperations();
function saveTasks() {
    return new Promise((resolve, reject) =&gt; {
        const serializedTasks = JSON.stringify(taskList);
        localStorage.setItem(&#39;tasks&#39;, serializedTasks);
        resolve();
    });
}
async function loadTasks() {
    return new Promise((resolve, reject) =&gt; {
        const serializedTasks = localStorage.getItem(&#39;tasks&#39;);
        if (serializedTasks) {
            taskList = JSON.parse(serializedTasks);
            resolve();
        } else {
            reject();
        }
    });
}
const taskNameInput = document.getElementById(&#39;taskName&#39;);
const dueDateInput = document.getElementById(&#39;dueDate&#39;);
const priorityInput = document.getElementById(&#39;priority&#39;);
const addTaskBtn = document.getElementById(&#39;addTaskBtn&#39;);
const taskListContainer = document.getElementById(&#39;taskList&#39;);
function renderTasks() {
    taskListContainer.innerHTML = &#39;&#39;;
    taskList.forEach(task =&gt; {
        const taskItem = document.createElement(&#39;div&#39;);
        taskItem.className = `task ${task.completed ? &#39;completed&#39; : &#39;&#39;}`;
        taskItem.innerHTML = `
            &lt;span&gt;${task.getTaskDetail()}&lt;/span&gt;
            &lt;button class=&quot;deleteTaskBtn&quot;&gt;Delete&lt;/button&gt;
        `;
        const deleteTaskBtn = taskItem.querySelector(&#39;.deleteTaskBtn&#39;);
        deleteTaskBtn.addEventListener(&#39;click&#39;, () =&gt; {
            taskOperations.deleteTask(task.taskName);
            renderTasks();
        });
        taskItem.addEventListener(&#39;click&#39;, () =&gt; {
            task.toggleCompletion();
            renderTasks();
        });

        taskListContainer.appendChild(taskItem);
    });
}
function addTaskUI() {
    const taskName = taskNameInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
   
    if (taskName &amp;&amp; dueDate &amp;&amp; priority) {
        const task = new Task(taskName, dueDate, priority);
        taskOperations.addTask(task);
        taskNameInput.value = &#39;&#39;;
        dueDateInput.value = &#39;&#39;;
        priorityInput.value = &#39;low&#39;;
        saveTasks().then(() =&gt; {
            renderTasks();
        });
    }
}
addTaskBtn.addEventListener(&#39;click&#39;, addTaskUI);
loadTasks().then(() =&gt; {
    renderTasks();
});