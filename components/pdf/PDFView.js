import React from 'react';
import { GeneratePdf } from './GeneratePdf';
import { PDFbase } from './PDFbase';

export class PDFView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			document: null
		}

	}

	async componentDidMount() {

		if (this.props.format && this.props.data) {
			let pdf = await new GeneratePdf(this.props.format, this.props.data).getPdf();
			this.setState({ document: pdf });
		}

	}

	render() {
		return (
			<PDFbase document={this.state.document} />
		);
	}
}