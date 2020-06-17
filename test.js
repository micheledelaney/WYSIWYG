/*******************************************************************/
/* Light-weight, simple WYSIWYG text editor written in JS (ES6)    */
/* No dependencies, no libraries - just vanilla JS                 */
/* Only 0.856KB                                                    */
/* Michèle Delaney                                                 */
/*******************************************************************/

var createElement = function createElement(tag) {
    return document.createElement(tag);
};
var queryCommandState = function queryCommandState(command) {
    return document.queryCommandState(command);
};
var queryCommandValue = function queryCommandValue(command) {
    return document.queryCommandValue(command);
};
var getElementById = function getElementById(command) {
    return document.getElementById(command);
};
var exec = function exec(command) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    document.execCommand(command, false, value);
};


class Editor {
    constructor(commands) {
        this.formatBlock = 'formatBlock';
        this.defaultParagraphSeparator = '<p>';
        this.toolbar = this.createToolbar();
        this.textbox = this.createTextbox();
        /* map all the elements from array and create those buttons */
        commands.map(command => this[command]());
        /* calculate the width for each button and assign it to the css variable */
        document.documentElement.style.setProperty('--number-buttons', (100 / commands.length) + "%");

    };
    createToolbar() {
         /* create toolbar for buttons */
         let toolbar = createElement('div');
         toolbar.id = 'toolbar';
         toolbar.classList.add('editor-toolbar');
         document.getElementById('editor').appendChild(toolbar);
         return toolbar;
    }
    createTextbox() {
        /* create textbox contenteditable for user input */
        let content = createElement('div');
        content.contentEditable = true;
        content.classList.add('editor-content')
        content.id = 'textbox';
        document.getElementById('editor').appendChild(content);
        content.oninput = (ref) => {
            let firstChild = ref.target.firstChild;
            if (firstChild && firstChild.nodeType === 3) {
                exec('formatBlock', '<p>');
            }
        };
        /*escape the blockquote/pre when 'enter' */
        content.onkeydown = function (event) {
            let format = queryCommandValue('formatBlock');
            if (event.key === 'Enter' && (format === 'blockquote' || format === 'pre')) {
                setTimeout(function () {
                    return exec('formatBlock', '<p>');
                } , 0 );
            }
        };
        return content;
    }
    createFormatButton(type, icon) {
        let button = createElement('button');
        button.id = type;
        button.innerHTML = icon;
        button.classList.add('editor-button');
        button.onclick = () => {exec(type)};
        this.toolbar.appendChild(button);
        return button;
    }
    createFormatblockButton(id, icon, type) {
        let button = createElement('button');
        button.id = id;
        button.innerHTML = icon;
        button.classList.add('editor-button');
        button.onclick = () => {exec(this.formatBlock, type)};
        this.toolbar.appendChild(button);
        return button;
    }
    focusTextbox() {
        this.textbox.focus();
    }
    listenForStateChanges(button) {
        let state = () => {return queryCommandState(button.id)};
        let handler = () => {return button.classList[state() ? 'add' : 'remove']('button-selected')};
        this.textbox.addEventListener('keyup', handler);
        this.textbox.addEventListener('mouseup', handler);
        this.toolbar.addEventListener('click', handler);
    }
    removeformat() {
        let button = this.createFormatButton('removeFormat', '&#9003');
    }
    bold() {
        let button = this.createFormatButton('bold', '<b>B</b>');
        this.listenForStateChanges(button);
    }
    italic() {
        let button = this.createFormatButton('italic', '<i>I</i>');
        this.listenForStateChanges(button);
    }
    underline() {
        let button = this.createFormatButton('underline', '<u>U</u>');
        this.listenForStateChanges(button);
    }
    strikethrough() {
        let button = this.createFormatButton('strikeThrough', '<strike>S</strike>');
        this.listenForStateChanges(button);
    }
    outdent() {
        this.createFormatButton('outdent', '&#8676');
    }
    indent() {
        this.createFormatButton('indent', '&#8677');
    }
    unorderedList() {
        let button = this.createFormatButton('insertUnorderedList', '&#8226;');
        this.listenForStateChanges(button);
    }
    orderedList() {
        let button = this.createFormatButton('insertOrderedList', '&#35;');
        this.listenForStateChanges(button);
    }
    justifyleft() {
        let button = this.createFormatButton('justifyleft', '|..');
        this.listenForStateChanges(button);
    }
    justifycenter() {
        let button = this.createFormatButton('justifycenter', '.|.');
        this.listenForStateChanges(button);
    }
    justifyright() {
        let button = this.createFormatButton('justifyright', '..|');
        this.listenForStateChanges(button);
    }
    code() {
        let button = this.createFormatblockButton('code', '&lt;/&gt;', '<pre>');
        //this.listenForStateChanges(button);
    }
    paragraph() {
        let button = this.createFormatblockButton('paragraph', '&#182;', '<p>');
        //this.listenForStateChanges(button);
    }
    blockquote() {
        let button = this.createFormatblockButton('blockquote', '&#10078;', '<blockquote>');
        //this.listenForStateChanges(button);
    }
    horizontalrule() {
        let button = this.createFormatButton('insertHorizontalRule', '-');
    }
    createlink() {
        let button = createElement('button');
        button.id = 'createLink';
        button.innerHTML = '&#128279;';
        button.classList.add('editor-button');
        this.toolbar.appendChild(button);
        button.onclick = () => {
            let url = window.prompt('Enter the link URL');
            if (url) exec('createLink', url);
        }
    }
    image() {
        let input = createElement('input');
        input.id = 'insertImage';
        input.setAttribute('type', 'file');
        input.style.display = 'none';

        let label = createElement('label');
        label.innerHTML = '&#128247;';
        label.classList.add('editor-button');
        label.id = 'image';
        label.setAttribute('for','insertImage');

        this.toolbar.appendChild(input);
        this.toolbar.appendChild(label);

        input.onchange = () => {

            loadImageFileAsURL();

        }
    }
    size() {
        /* create select drowpdown */
        let select = createElement('select');
        select.classList.add('editor-button');
        select.id = 'fontsize';
        let sizes = [
			{
				name: '8pt',
				value: '1'
			},{
				name: '10pt',
				value: '2'
			},{
				name: '12pt',
				value: '3'
			},{
				name: '14pt',
				value: '4'
			},{
				name: '16pt',
				value: '5'
			},{
				name: '18pt',
				value: '6'
			},{
				name: '24pt',
				value: '7'
			}
		];
        sizes.forEach(size => {
            let option = createElement('option');
            option.innerHTML = size.name;
            option.value = size.value;
            option.selected = size.value === '3';
            select.add(option);
        });

        this.toolbar.appendChild(select);

        select.onchange = () => {
            let value = select[select.selectedIndex].value;
            exec('fontsize', value);
            getElementById('textbox').focus();
        }

        let handler = function handler() {
            let index = queryCommandValue('fontSize') || 3;
            select[index - 1].selected =  'selected';
        };

        this.textbox.addEventListener('keyup', handler);
        this.textbox.addEventListener('mouseup', handler);
        this.toolbar.addEventListener('click', handler);
    }
};


/*******************************************************************/
/* everything below is still work in progress                      */
/*******************************************************************/


/* Callback function to execute when mutations are observed */
const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        console.log(mutation.type);
        /* Only do something if the child (the img) has been changed */
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            //mutation.target.remove();

        }

    }
};

/* to get the file data from the input field as base64 */
function getBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      return reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
}

function loadImageFileAsURL() {
    document.getElementById('textbox').focus();
    /* get the file that has been selected */
    let filesSelected = document.getElementById('insertImage').files;
    if (filesSelected.length > 0) {
        let fileToLoad = filesSelected[0];
        
        if (fileToLoad.type.match('image.*')) {
            /* read the file into the filereader and get the data as base64 */
            let fileReader = new FileReader();
            fileReader.readAsDataURL(fileToLoad);
            fileReader.onload = function(fileLoadedEvent) {
                /* create an img element and set its source to the base64 string */
                let imageLoaded = document.createElement('img');
                imageLoaded.src = fileLoadedEvent.target.result;
                /* create a div with the attribute 'resize' set to true so
                that the image can get resized */
                let ed = document.createElement('div');
                let el = document.createElement('div');
                el.className = "resize";
                imageLoaded.style.maxWidth = '100%';
                el.style.width = '100px';
                el.appendChild(imageLoaded);
                ed.appendChild(el);
            
                /* create a mutationobserver to check if the img gets 
                deleted at a later point -> div needs to get deleted too */
                const observer = new MutationObserver(callback);
                const config = {childList: true };
                observer.observe(ed, config);

                /* append the img to the textbox */
                document.getElementById('textbox').appendChild(ed);
            };
        }
    }
}