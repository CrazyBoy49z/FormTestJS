var FormExample = function FormExample() {
	this.getData = this.getData.bind(this);
	this.setData = this.setData.bind(this);
	this.validate = this.validate.bind(this);
	this.submit = this.submit.bind(this);
	this.form = document.getElementById('myForm');
	this.form.addEventListener('submit', this.submit.bind(this));
}
FormExample.prototype.getData = function() {
    var data = {};
    var elements = this.form.elements;
    for (var i in elements) {
      if (elem.hasOwnProperty(i)) {
        var element = elem[i];
        var valElement = function(elem) { 
			return elem.name === elem.type
		}
        if (valElement(elem)) {
          data[elem.name] = elem.value;
        }
      }
    }
    return data;
}
FormExample.prototype.setData = function(data) {
    var allowableIindices = ['fio', 'email', 'phone'];
    for (var i in data) {
      if (data.hasOwnProperty(i)){
        var value = data[i];
        if (allowableIindices.includes(i)) {
          if (this.form.elements[i]) {
            this.form.elements[i].value = value;
          }
        }
      }
    }
}
FormExample.prototype.validate = function() {
    var errorFields = [];
	
    var domains = ['yandex.ru', 'ya.ru', 'yandex.com', 'yandex.ua', 'yandex.by', 'yandex.kz' ];
	var spEmail = document.getElementById('email').value.split('@');
	var domain = spEmail[1];
    if (spEmail.length === 2 && !domains.includes(domain)) {
      errorFields.push('email');
    }
    
    var fio = document.getElementById('fio').value;
    if (document.getElementById('fio').value.trim().split(/\s+/).length !== 3) {
	    errorFields.push('fio');
    }

    var phone = document.getElementById('phone').value;
    var phoneReg = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);
    var phoneNumberSum = function(number) {
		return number.match(/\d/g).reduce(function(a, b) {
			return Number(a) + Number(b);
		})
	} 
    if (!phoneReg.test(phone) || phoneNumberSum(phone) >= 30) {
		errorFields.push('phone');
    }
    return {
      isValid: errorFields.length === 0,
      errorFields
    };
}
FormExample.prototype.submit = function(e) {
    e.preventDefault();
    for (var elem of document.getElementsByTagName('input')) {
      elem.classList.remove('error');
    }
    var vr = this.validate();
    var resultContainer = document.getElementById('resultContainer');
    if (vr.isValid) {
      document.getElementById('submitButton').disabled = true;
	  var getData = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.form.action, false);
        xhr.send();
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          switch (data.status) {
            case 'success':
              resultContainer.className = 'success';
              resultContainer.innerHTML = 'Success';
            break;
            case 'error':
              resultContainer.className = 'form__input error';
              resultContainer.innerHTML = data.reason;
            break;
            case 'progress':
              resultContainer.className = 'form__input progress';
              setTimeout(getData, data.timeout);
            break;
          }
        }
      };
      getData();
    } else {
      vr.errorFields.forEach(function(item) {return document.getElementById(item).className = 'form__input error'});
    }
}
var MyForm = new FormExample();