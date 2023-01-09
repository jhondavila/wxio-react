import React from 'react';
import { Table } from '../table'
import { Modal, Button } from 'react-bootstrap';

export class SearchModal extends React.Component {
	constructor(opts) {
		super(opts);
		this.state = {
			search: "",
			show: true
		}

		window.search = window.search || [];
		window.search.push(this)
	}

	async componentDidMount() {
		if (this.props.store) this.props.store.clearFilters();

		if (this.state.show) await this.applyStaticFilters();


		if (this.props.value) {
			this.loadRecord();
		}
	}

	async componentDidUpdate(prevProps) {

		if (prevProps.show !== this.props.show) {
			await this.applyStaticFilters()
			
		}
		if (prevProps.value !== this.props.value) {
			this.loadRecord();
		}
	}

	async applyStaticFilters() {
		let show = this.state.show;
		if (show && this.props.store) {
			this.props.store.setStaticFilters(this.props.staticFilters);
			await this.props.store.load();
		} else {
			if(this.props.store) this.props.store.clearStaticFilters();
		}
	}
	async loadRecord() {
		if (!this.props.value) {
			this.setState({
				record: null
			});
			if (this.props.onLoadRecord) {
				this.props.onLoadRecord(null);
			}
			return;
		}
		let value = this.props.value;
		let key = this.props.valueField;

		let record = this.props.store.find({ [key]: value })

		if (!record) {
				let filters = this.props.customValueField.map((i) => {
					return {
						property: i,
						value: value,
						type: "or_like",
						ignoreCase: true,
						cast: true
					}
				});
				await this.props.store.loadByFilters(filters);
	
				record = this.props.store.find({ [key]: value })
		}
		if (record) {

			this.setState({
				record: record
			});

			if (this.props.onLoadRecord) {
				this.props.onLoadRecord(record);
			}
		} else {
			console.error("VALUE RECORD NO FOUND =>>", this.props.value)
		}
	}

	onClick = () => {
		this.setState({
			show: true,

		})
	}
	handlerClose = () => {
		this.props.store.clearFilters();
		// this.props.store.load();

		this.setState({
			show: false
		});
		this.props.resolve(false);
		//this.props.onClose();
	}

	handlerAceptar = () => {

		this.props.resolve(this.table.getSelection());
		
		this.setState({
			show: false
		});

		if(this.props.store){
			this.props.store.clearFilters();
			this.props.store.load();

		}
	}

	onClearSelection = () => {
		this.setState({
			record: null
		});
		
		if (this.props.selectRecord) {
			this.props.selectRecord(null);
		}
	}

	onClickRow = (record) => {
		this.setState({
			recordSelected: record
		});

	}

	onDblClickRow = (record) => {
		this.setState({
			show: false,
			record: record
		});

		this.props.resolve(record);
		/*
		if (this.props.selectRecord) {
			this.props.selectRecord(record);
		}
		*/


	}

	onKeyPress = (e) => {
		if (e.key === "Enter") {
			this.setState({
				show: true
			})
		}
	}

	search = createBuffered(async (value) => {
		if (this.props.store) {
			this.props.store.clearFilters();

			let filters;
			if (this.props.customSearch) {
				filters = this.props.customSearch.map((i) => {
					return {
						property: i,
						value: value,
						type: "or_like",
						ignoreCase: true,
						cast: true
					}
				});
			} else {
				filters = this.props.columns.map((i) => {
					return {
						property: i.dataIndex,
						value: value,
						type: "or_like",
						ignoreCase: true,
						cast: true
					}
				});
			}

			this.props.store.setFilters([
				{
					type: "group",
					where: filters
				}]);

			await this.props.store.load();
		}
	}, 500)
	onTextSearchChange = async (e) => {
		let value = e.target.value
		this.setState({
			search: value
		});
		//if(!this.props.store.loading){	
		this.search(value);
		//}

	}
	render() {
		return (
			<Modal
				show={this.state.show}
				onHide={this.handlerClose.bind(this)}
				animation={true}
				centered={true}
				backdrop="static"
				keyboard={true}
				dialogClassName={"search-modal-dialog"}
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input className="fieldsearch" type="text" value={this.state.value} onChange={this.onTextSearchChange} />
					<Table
						selectionMode={this.props.multiSelection ? "multiple" : null}
						ref={c => this.table = c}
						onDblClickRow={this.onDblClickRow}
						columns={this.props.columns}
						store={this.props.store}
						toolPage={true}
						staticFilters={this.props.staticFilters}
						autoLoad={false}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.handlerClose}>Cancelar</Button>
					<Button variant="primary" onClick={this.handlerAceptar}>Aceptar</Button>
				</Modal.Footer>
			</Modal>
		)
	}

}

const createBuffered = (fn, buffer, scope, args) => {
	var timerId;

	return function () {
		var callArgs = args || Array.prototype.slice.call(arguments, 0),
			me = scope || this;

		if (timerId) {
			clearTimeout(timerId);
		}

		timerId = setTimeout(function () {
			fn.apply(me, callArgs);
		}, buffer);
	};
}
