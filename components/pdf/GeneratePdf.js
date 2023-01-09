import React from 'react'
import { jsPDF } from "jspdf";
import qrcode from 'yaqrcode';


export class GeneratePdf {

	#doc = null;

	#fontSize = 8;
	#fontType = 'normal'
	#fontDefauld = 'Arial'

	dataUri = null
	constructor(opts, data) {
		this.#doc = new jsPDF("p", "mm", "a4");

		this.#fontSize = opts.fontSize;
		this.#fontDefauld = opts.fontDefauld;

		//debugger
		for (let x = 0; x < opts.content.length; x++) {
			switch (opts.content[x].type) {
				case 'label':
					this.#addText(opts.content[x].text, opts.content[x].x, opts.content[x].y, opts.content[x].Options);
					break;
				case 'text':
					let text = opts.content[x].label ? `${opts.content[x].label}: ${data[opts.content[x].field]}` : data[opts.content[x].field];
					this.#addText(text, opts.content[x].x, opts.content[x].y, opts.content[x].Options);
					break;
				case 'rectangle':
					this.#addRectangle(opts.content[x].left, opts.content[x].top, opts.content[x].width, opts.content[x].height, opts.content[x].color, opts.content[x].label);
					break;
				case 'line':
					this.#addLine(opts.content[x].orientation, opts.content[x].top, opts.content[x].left, opts.content[x].width);
					break;
			}
		}

	}

	getPdf() {
		return this.#doc.output('datauristring');
	}

	#addText = (valor = "", x = 10, y = 10, options = {}) => {

		let { type = this.#fontType, font = this.#fontDefauld, fontSize = this.#fontSize, align = 'left' } = options;
		
		this.#doc.setFontSize(fontSize);
		this.#doc.setFont(font, type);

		let text = valor ? String(valor) : "";

		if (align) {
			this.#doc.text(text, x, y, { aling: align });
		} else {
			this.#doc.text(text, x, y);
		}
	}

	#addRectangle = (x = 0, y = 0, width, height, color, label) => {
		//this.#doc.setDrawColor(0);
		if(color){
			this.#doc.setFillColor(color);
			this.#doc.rect(x, y, width, height, 'F')
		}else{
			this.#doc.rect(x, y, width, height, 'S')
		}

		if(label){
			
			this.#doc.setFont('helvetica','bold');
			this.#doc.setFontSize(this.#fontSize);

			let  textWidth = this.#doc.getStringUnitWidth(label) * this.#doc.internal.getFontSize() / this.#doc.internal.scaleFactor;
			let textOffset = (this.#doc.internal.pageSize.width - textWidth) / 2;
			this.#doc.text(label, textOffset, y+4);
		}
	}

	#addLine = (orientation = 'horizontal', top, left, width ) => {
		//this.#doc.setDrawColor(0);
	
	//	this.#doc.setFillColor(255, 255, 255);
	if(orientation=='horizontal') {
		this.#doc.line(left, top, width, top);
	}else{
		this.#doc.line(left, top, left , width);

	}
		
	}
}


/*
export const GeneratePdf = () => {

	constructor(opts) {
		super(opts);
		this.state = {
			doc: new jsPDF("p", "mm", "a3"),
			fontSize: opts.fontSize || 12,
			dataUri : null

		}

	}

	componentDidMount(){
		this.setState({dataUri:this.state.doc.output('datauri')})
	}

	addText(valor = "", x = 10, y = 10, options = {}) {

		let { type = 'normal', fontSize = this.state.fontSize, align = 'left' } = options;

		this.state.doc.setFontSize(fontSize);
		this.state.doc.setFont('helvetica', type);

		if (align) {
			this.state.doc.text(valor, x, y, { aling: align });
		} else {
			this.state.doc.text(valor, x, y);
		}
	}

	render(){
		return this.state.dataUri
	}
}
*/