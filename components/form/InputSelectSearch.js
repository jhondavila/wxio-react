import React from 'react';
import { Table } from 'Wx/components/table';
import { Modal, Button } from 'react-bootstrap';
import { ModalSearch } from "./ModalSearch";
import "./InputSelectSearch.scss";

export class InputSelectSearch extends React.Component {
	constructor(opts) {
		super(opts);
		this.state = {
			show: false,
			search: "",
			recordSelected: null
		}
	}
	async componentDidMount() {
		// this.props.store.setStaticFilters(this.props.staticFilters)
		if (this.props.value) {
			this.loadRecord();
		}
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.value !== this.props.value) {
			// this.props.store.setStaticFilters(this.props.staticFilters)
			this.loadRecord();
		}
		// else if(prevProps.staticFilters !== this.props.staticFilters){
		// 	// this.props.store.setStaticFilters(this.props.staticFilters)
		// }
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

		if (!record) { record = await this.props.store.loadByProperty(key, value); }
		
		if (record) {

			this.setState({
				record: record,
				state: this.props.value
			});

			if (this.props.onLoadRecord) {
				this.props.onLoadRecord(record);
			}
		} else {
			this.setState({
				record: null,
				error: true
			});			
		}
	}

	onClick = () => {
		/*
		this.props.store.loadByProperty({
			staticFilters: this.props.staticFilters
		})
*/
		//this.props.store.load();
		this.setState({
			show: true,
		})
	}
	handlerClose = () => {
		this.setState({
			show: false
		})
	}

	onClearSelection = () => {
		this.setState({
			record: null,
			value: null,
			error: false
		});
	
		if (this.props.selectRecord) {
			this.props.selectRecord(null);
		}
		if (this.props.onChangeValue) {
			this.props.onChangeValue(null);
		}
	}


	onKeyPress = (e) => {
		if (e.key === "Enter") {
			this.setState({
				show: true
			})
		}
	}

	render() {
		return (
			<div className={`input-select-search ${this.state.error ? 'warning':''}`} tabIndex="0" onKeyPress={this.onKeyPress} disabled={this.props.disabled}>
				<div className="content">
					{
						this.state.record ?
							!this.props.displayTpl ? null : this.props.displayTpl(this.state.record)
							:
							this.props.value
					}
				</div>
				{
          !this.props.disabled ? (
					this.state.record || this.props.value ?
						<i className="far fa-trash-alt" onClick={this.onClearSelection}></i>
						: null)
          : null  
				}
        {
          !this.props.disabled ?
          <i className="fad fa-search" onClick={this.onClick}></i>
          : null
        }
				<ModalSearch
					show={this.state.show}
					onClose={this.handlerClose}
					columns={this.props.columns}
					keyId={this.props.keyId}
					addOption={this.props.addOption}
					store={this.props.store}
					title={this.props.title}
					staticFilters={this.props.staticFilters}
					selectRecord={(record) => {
						this.setState({
							record: record,
							error: false,
							value: record[this.props.valueField]
						});
						if (this.props.selectRecord) {
							this.props.selectRecord(record);
						}
						if(this.props.onChangeValue){
							this.props.onChangeValue(record[this.props.valueField])
						}
						this.forceUpdate();
					}}
				// onLoadRecord={(record) => {
				// 	this.props.onLoadRecord(record);
				// }}
				/>
			</div>
		)
	}

}
