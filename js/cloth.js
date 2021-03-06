/**
 *	@description Cloth is a simple HTML element library. It allows HTML to be
 *		dynamically generated within a javascript file. It was developed as a
 *		pure HTML/css alternative to the Phaser.io plugin Phaser-Input.
 *	@class cloth
 *	@author Michael Parkinson <SubFiApp@gmail.com>
 */
!function () {
	/** cloth object containing the current version number.*/
	var cloth = {
		version : "0.0.1"
	},
	cloth_document = this.document;
	if (typeof define === "function" && define.amd) {
		this.cloth = cloth;
		define(cloth);
	} else if (typeof module === "object" && module.exports) {
		module.exports = cloth;
	} else {
		this.cloth = cloth;
	}

	/**
	 *	@description Sets CSS attributes for a HTML element. Loops through all the
	 *		keys in the attrs object and uses the method element.setAttribute.
	 *		Invalid keys and attributes are ignored.
	 *	@memberof cloth
	 *	@function edit
	 *	@param {element} element The HTML element that is being created.
	 *	@param {object} attrs The attribute object. This contains any
	 *		inline parameters. I suggest containing the id parameter.
	 *	@tutorial setAttributes(elementID,{'id':'elementID','type':'elementType'});
	 */
	function setAttributes(element, attrs) {
		if (attrs !== null && typeof attrs === 'object') {
			for (var key in attrs) {
				element.setAttribute(key, attrs[key]);
			}
		}
	};

	/**
	 *	@description The main function for cloth.js. cloth.append takes in the parentID
	 *		HTML element then appends an element of type ElementID with attributes
	 *		attrs. If the parent does not exist then the elementID is attached to
	 *		the body. The function must be called after the document has loaded.
	 *	@memberof cloth
	 *	@function append
	 *	@param {string} parentID The name of the parent HTML element.
	 *	@param {string} elementType The HTML element type that is appened to parent HTML element.
	 *	@param {object} attrs The attribute object {@see cloth#setAttributes}.
	 *	@param {boolean} prepend Optional flag for prepending the HTML element in front of any other element.
	 *	@tutorial cloth.append('exampleDiv', 'input', attrs={ 'id' : 'exampleID', 'type' : 'submit', 'value' : 'Login'});
	 */
	cloth.append = function (parentID, elementType, attrs, prepend) {
		if (typeof prepend === 'undefined') {
			prepend = false;
		} // Prepend flag set to false if not defined.
		parentElement = cloth_document.getElementById(parentID);
		if (parentElement === undefined || parentElement === null) { // If the parentElement does not exist.
			parentElement = cloth_document.createElement(elementType); // Create it!
			setAttributes(parentElement, attrs);
			try { // Catches a TypeError thrown because the document does not exist.
				if (!prepend) {
					cloth_document.body.appendChild(parentElement);
				} else {
					cloth_document.body.insertBefore(parentElement, cloth_document.body.childNodes[0]);
				}
			} catch (err) {
				// The Error now produces a warning.
				console.warn('Warning: ' + err.message + ' \n	Check if the document loads before cloth attempts to append.')
			}
		} else { // If the parentElement does exist.
			childElement = cloth_document.createElement(elementType);
			setAttributes(childElement, attrs);
			if (!prepend) {
				parentElement.appendChild(childElement);
			} else {
				parentElement.insertBefore(childElement, parentElement.childNodes[0]);
			}
		}
	};

	/**
	 *	@description An element created with cloth.append {@see cloth#append} with an id
	 *		given in the attrs object can be removed with this function. If the element
	 *		does not exist then nothing happens. Any HTML element created with
	 *		cloth.append should have an input have an 'id' in the attrs object.
	 *	@memberof cloth
	 *	@function remove
	 *	@param {string} elementID The name of the HTML element that will be removed.
	 *	@tutorial cloth.remove('exampleID');
	 */
	cloth.remove = function (elementID) {
		var element = cloth_document.getElementById(elementID);
		if (element !== undefined && element !== null) {
			element.parentNode.removeChild(element);
		}
	};

	/**
	 *	@description Retrieve a value from an element with an id. If the value does
	 *		not exist then undefined is returned instead of the value. If the element
	 *		only has an innerHTML associated with it then the innerHTML flag can be
	 *		set to true.
	 *	@memberof cloth
	 *	@function retrieve
	 *	@param {string} elementID The name of the HTML element.
	 *	@param {boolean} innerHTML Optional flag
	 *	@returns {number|undefined} Returns the value or innerHTML of the HTML element.
	 *	@tutorial cloth.retrieve('exampleID',false);
	 */
	cloth.retrieve = function (elementID, innerHTML) {
		var element = cloth_document.getElementById(elementID);
		if (element !== undefined && element !== null) {
			if (!innerHTML) {
				return element.value;
			} else {
				return element.innerHTML;
			}
		} else {
			return undefined;
		}
	};

	/**
	 *	@description Changes the value of the HTML element with an id of elementID. If
	 *		the element only takes innerHTML then the innerHTML flag can be true. The
	 *		elementValue is still used when the innerHTML flag is set true. The flag
	 *		is set to false by default.
	 *	@memberof cloth
	 *	@function value
	 *	@param {string} elementID The name of the HTML element.
	 *	@param {string} elementValue The new value for the HTML element.
	 *	@param {boolean} innerHTML Optional flag for elements that have innerHTML.
	 *	@tutorial cloth.value('exampleID',42,false);
	 */
	cloth.adjust = function (elementID, elementValue, innerHTML) {
		if (typeof innerHTML === 'undefined') {
			innerHTML = false;
		} // Flag set to false if not defined.
		var element = cloth_document.getElementById(elementID);
		if (element !== undefined && element !== null) {
			if (!innerHTML) {
				element.value = elementValue;
			} else {
				element.innerHTML = elementValue;
			}
		}
	};

	/**
	 *	@description Changes the focus to a HTML element with an id of elementID.
	 *	@memberof cloth
	 *	@function focus
	 *	@param {string} elementID The name of the HTML element.
	 *	@param {boolean} defocus Optional flag to defocus from an HTML element.
	 *	@tutorial cloth.focus('exampleID');
	 */
	cloth.focus = function (elementID, defocus) {
		if (typeof defocus === 'undefined') {
			defocus = false;
		} // Flag set to false if not defined.
		var element = cloth_document.getElementById(elementID);
		if (element !== undefined && element !== null) {
			if (!defocus) {
				element.focus();
			} else {
				element.blur();
			}
		}
	};
	
	/**
	 *	@description Attempts to scale a HTML element. If there is any inline css
	 *		then it will be perserved during a scaling event.
	 *	@memberof cloth
	 *	@function scale
	 *	@param {string} elementID The name of the HTML element.
	 *	@param {number} scaleValue A number representing how much to zoom in or out.
	 *	@tutorial cloth.scale('exampleDiv',1.25);
	 */
	cloth.scale = function (elementID, scaleValue) {
		var element = cloth_document.getElementById(elementID);
		var oldCSS = element.style;
		var newCSS = 'transform:scale('+scaleValue+');';
		for (var i=0;i<oldCSS.length;i++) {
			if(oldCSS[i] !== 'transform'){
				newCSS += oldCSS[i]+':'+oldCSS[oldCSS[i]]+';';
			}
		}
		if (element !== undefined && element !== null) {
			setAttributes(element,attrs={'style':newCSS});
		}
	};
	//End of clothjs.
}
();
