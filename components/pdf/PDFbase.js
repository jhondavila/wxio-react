import React, { useEffect } from 'react';
// import * as pdfjsLib from 'pdfjs-dist';
import PDFViewer from 'pdfjs-dist/web/pdf_viewer';
import { Table, Cell, ToolBar, Panel, BtnBar } from './index';

import { Row, Col } from 'react-bootstrap';
import pdf from 'pdfjs-dist';
import { history } from "../_helpers/history"
// import pdfjsLib from "pdfjs-dist/build/pdf";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// import { } from "pdfjs-lib"
// console.log(PDFViewer)

//import pdfjsWorker from "pdfjs-dist/build/pdf.worker";
// pdfjsLib.GlobalWorkerOptions.workerSrc = "";

// window.pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
export class PDFbase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pdf: null,
			currentPage: 1,
			zoom: 1,
			src: `${document.location.origin}/pdf/web/viewer.html`
			// baseUrl: "http://192.168.1.14:3000/pdf/web/viewer.html",
			// url: `${document.location.origin}/hola.pdf`
		}
		// console.log(this.props)
	}
	// loadPDF = async () => {

	// http://localhost:3000/pdf/web/viewer.html?file=http://localhost:3000/hola.pdf
	// let baseUrl = this.props.baseUrl || `${document.location.origin}/pdf/web/viewer.html`
	// let src = `${baseUrl}`
	// console.log(src);
	// this.setState({
	//     src: src
	// });
	// }
	async componentDidMount() {
		GeneratePdf
		
		this.iframe.onload = () => {
			// let pdfapp = this.iframe.contentWindow.PDFViewerApplication;
			if (this.props.document) {
				this.loadDocument(this.props.document)
			}
		}
	}

	b64toBlob(b64Data, contentType) {
		contentType = contentType || '';
		var sliceSize = 512;
		b64Data = b64Data.replace(/^[^,]+,/, '');
		b64Data = b64Data.replace(/\s/g, '');
		var byteCharacters = window.atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}
	async componentDidUpdate(prevProps) {
		console.log("componentDidUpdate")
		if (prevProps.document !== this.props.document) {
			if (this.props.document) {
				this.loadDocument(this.props.document)
			}
		}
	}

	async loadDocument(document) {
		try {
			//console.log('aqui',document);
			let pdfapp = await this.iframe.contentWindow.PDFViewerApplication;
			//let file = this.b64toBlob(document, "application/pdf")
			//var fileURL = URL.createObjectURL(file);
			//var fileURL = URL.createObjectURL(document);
			if(pdfapp){
				pdfapp.open(document);
				
			}
		} catch (error) {
			console.log(error);
		}
	}

	download() {
		let pdfapp = this.iframe.contentWindow.PDFViewerApplication;
		pdfapp.download();
	}
	pageUp() {
		let pdfapp = this.iframe.contentWindow.PDFViewerApplication;
		pdfapp.pdfPresentationMode._goToPreviousPage()
		// console.log(pdfapp)
		// console.log("pageUp")
	}
	pageDown() {
		let pdfapp = this.iframe.contentWindow.PDFViewerApplication;
		pdfapp.pdfPresentationMode._goToNextPage()
		// console.log("pageDown")
	}
	zoomMinus() {
		let pdfapp = this.iframe.contentWindow.PDFViewerApplication;
		pdfapp.zoomOut();
		// console.log("zoomMinus")
	}
	zoomPlus() {
		let pdfapp = this.iframe.contentWindow.PDFViewerApplication;
		pdfapp.zoomIn();
		// console.log("zoomPlus")
	}
	backPage() {
		history.goBack();
		console.log("backPage")
	}
	render() {
		return (
			<>
				<ToolBar>
					<Col className="m-0 p-0 align-items-center d-flex">

						<BtnBar className="text-center" iconCls="fas fa-arrow-to-left" onClick={this.backPage.bind(this)}></BtnBar>
						<BtnBar className="text-center" iconCls="far fa-arrow-up" onClick={this.pageUp.bind(this)}></BtnBar>
						<BtnBar className="text-center" iconCls="far fa-arrow-down" onClick={this.pageDown.bind(this)}></BtnBar>
					</Col>


					<Col className="m-0 p-0 align-items-center d-flex justify-content-center">
						<BtnBar className="text-center" iconCls="fas fa-minus" onClick={this.zoomMinus.bind(this)}></BtnBar>
						<BtnBar className="text-center" iconCls="fas fa-plus" onClick={this.zoomPlus.bind(this)}></BtnBar>
					</Col>

					<Col className="m-0 p-0 align-items-center d-flex justify-content-end">
						<BtnBar className="text-center" iconCls="far fa-download" onClick={this.download.bind(this)}></BtnBar>

					</Col>

				</ToolBar>
				<iframe ref={c => this.iframe = c} src={this.state.src} height={"100%"} width={"100%"} />
			</>
		);
	}
}

//export default PDFbase;