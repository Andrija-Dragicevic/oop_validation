class Validator {
    constructor(config) {
        this.elementsConfig = config;
        this.errors = {};
        
        this.generateErrorsObject();
        this.inputListener();
    }

    generateErrorsObject() {
        for(let field in this.elementsConfig) {
            this.errors[field] = [];       //pravimo objekat za svako polje koji ima niz []
        }
    }

    inputListener() {
        let inputSelector = this.elementsConfig;   //odje uzimamo da je jednak elemetsConfig jer su u njemu upisani nazivi polja
        
        for(let field in inputSelector) {
            let el = document.querySelector(`input[name="${field}"]`);

            el.addEventListener('input', this.validate.bind(this));   //input je eventListener
        }
    }

    validate(e)  {    //e je za element iz kog uzimamo vrijednost i e nam je povezano sa bind(this), da bi smo dobili u koji input se unosi nesto
        let elFields = this.elementsConfig;

        let field = e.target;  //trentno polje
        let fieldName = field.getAttribute('name');
        let fieldValue = field.value;    //vrijednost sta je uneseno u polje

        this.errors[fieldName] = [];  // odje se upisuje errors za svaki fildName
        
        if(elFields[fieldName].required) {
            if(fieldValue === '') {     //provjeravamo da li ima nesto unutar polja
                this.errors[fieldName].push('Polje je prazno');
            }
        }
        if(elFields[fieldName].email) {
            if(!this.validateEmail(fieldValue)) {
                this.errors[fieldName].push('Neispravna email adresa');
            }
        }
        if(fieldValue.length < elFields[fieldName].minlength || fieldName.length > elFields[fieldName].maxlength) {
            this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`)
        }
        if(elFields[fieldName].matching) {
            let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);

            if(fieldValue !== matchingEl.value) {
                this.errors[fieldName].push('Lozinke se ne poklapaju');
            }
            if(this.errors[fieldName].length === 0) {
                this.errors[fieldName] = [];
                this.errors[elFields[fieldName].matching] = [];
            }
        }

        this.populateErrors(this.errors);
    }  
    
    populateErrors(errors) {
        for(const elem of document.querySelectorAll('ul')) {
            elem.remove();
        }
        for(let key of Object.keys(errors)) {
            let parentElement = document.querySelector(`input[name="${key}"]`).parentElement;
            let errorsElement = document.createElement('ul');
            parentElement.appendChild(errorsElement);

            errors[key].forEach(error => {
                let li = document.createElement('li');
                li.innerText = error;

                errorsElement.appendChild(li);
            });
        }
    }

    validateEmail(email) {
        if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return true;
        }
    }
}


