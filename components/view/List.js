
import React from 'react';
import {
	List,
	AutoSizer,
	CellMeasurer,
	CellMeasurerCache,
} from 'react-virtualized';
import equal from "fast-deep-equal";

import "./styles.scss"
class DataList extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			myData: [],
			selection: {},
			loadingData: true,
		};

		this.cache = React.createRef();

		this.cache = new CellMeasurerCache({
			fixedWidth: true,
			// defaultHeight: 70,
		});

	}

	addHooks(store) {
		store.on("add", this.onAddStore);
		store.on("loading", this.onLoadingStore);
		store.on("remove", this.onRemoveStore);
	}
	removeHooks(store) {
		store.removeListener("add", this.onAddStore);
		store.removeListener("loading", this.onLoadingStore);
		store.removeListener("remove", this.onLoadingStore);
	}

	onRemoveStore = (store) => {
		this.setState({
			myData: store.data
		});
	}

	onAddStore = (store) => {
		this.setState({
			myData: store.data
		});
	}

	onLoadingStore = (store, loading) => {
		this.setState({
			myData: store.data
		});

		if (this.bodyEl) {
			this.bodyEl.scrollTop = 0;
		}
		this.setState({
			loadingData: loading,
			order: store && store.sorters ? store.sorters[0] : null
		});
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.store !== this.props.store) {
			if (this.props.store) {
				this.addHooks(this.props.store)
				let data = await this.props.store.getData();
				let total = await this.props.store.total
				this.setState({
					myData: data,
					total: total
				});
			} else if (prevProps.store) {
				this.removeHooks(prevProps.store);
			}
		}
		if (prevProps.columns !== this.props.columns) {
			//	this.crearColumnas();
		}
		if (equal(prevProps.staticFilters, this.props.staticFilters) == false) {
			console.log(prevProps.staticFilters, this.props.staticFilters);

			this.props.store.setStaticFilters(this.props.staticFilters)
			this.props.store.load();
		}

	}

	componentWillUnmount() {
		if (this.props.store) {
			this.removeHooks(this.props.store);
		}
	}

	async componentDidMount() {
		if (this.props.store) {
			this.addHooks(this.props.store);
			if (this.props.store.modelParent && this.props.store.modelParent.phantom) {
				this.setState({
					myData: [],
					loadingData: false
				});
			} else {
				if (this.props.staticFilters) {
					this.props.store.setStaticFilters(this.props.staticFilters)
				}
				if (this.props.autoLoad) {
					await this.props.store.load();
				} else {
					let data = await this.props.store.getData();
					this.setState({
						myData: data,
						loadingData: false
					});
				}
			}
			let data = await this.props.store.getData();
			// console.log(data);


		} else if (this.props.data) {
			this.setState({
				myData: this.props.data,
				loadingData: false
			});
		} else {
			this.setState({
				myData: [],
				loadingData: false
			})
		}
	}
	selectionModel = (e, row) => {
		console.log(e.ctrlKey)
		if (this.props.onClickRow) {
			this.props.onClickRow(row);
		}
		if (this.props.selectionMode === "multiple" && e.ctrlKey) {

			let value = !this.state.selection[row.getId()];

			if (value) {
				this.setState({
					selection: {
						...this.state.selection,
						[row.getId()]: true
					}
				}, () => {
					this.selectionChange()
				});

			} else {
				let selection = Object.assign({}, this.state.selection);

				if (this.state.checkedAll) {

					for (let p in this.props.store.mapping) {
						selection[p] = true;
					}
				}
				delete selection[row.getId()];
				this.setState({
					checkedAll: false,
					selection: selection
				}, () => {
					this.selectionChange()
				});

			}
			/*
			this.setState({
				checkedAll: false,
				selection: {
					...this.state.selection,
					[row.getId()]: true
				}
			}, () => {
				this.selectionChange()
			});*/
		} else {
			if (!this.state.selection[row.getId()]) {
				this.setState({
					checkedAll: false,
					selection: {
						[row.getId()]: true
					}
				}, () => {
					this.selectionChange()
				});
			}
		}
	}
	selectionChange() {
		if (this.props.onSelectionChange) {
			let selection = [];
			if (this.state.checkedAll) {
				selection.push(...this.props.store.data);
			} else {
				for (let p in this.state.selection) {
					let record = this.props.store.getById(p);
					selection.push(record);
				}
			}
			this.props.onSelectionChange(selection)
		}
	}
	render() {
		let { store } = this.props;
		let count = store ? store.count() : 0;
		return (
			<AutoSizer>
				{({ width, height }) => {
					return (
						(
							<List
								width={width}
								height={height - this.props.reduceHeight}
								rowHeight={this.cache.rowHeight}
								deferredMeasurementCache={this.cache}
								rowCount={count}
								className={`wx-data-list list-inner` + this.props.className}
								rowRenderer={({ key, index, style, parent }) => {
									const record = store.getAt(index);
									const selected = this.state.selection[record.getId()] || this.state.checkedAll ? true : false
									return (
										<CellMeasurer
											key={record.get(this.props.propertyId)}
											cache={this.cache}
											parent={parent}
											columnIndex={0}
											rowIndex={index}
										>
											<div
												onClick={(e) => {
													this.selectionModel(e,  record)
												}}
												className={`wrapper-item ${selected ? "item-selected" : ""}`} style={style}>
												{
													this.props.displayTpl ? this.props.displayTpl({ key, index, parent, style, record }) : null
												}
											</div>

										</CellMeasurer>
									);
								}}
							/>
						)
					)
				}}
			</AutoSizer>
		)

	}
}
DataList.defaultProps = {
	propertyId: "id"
};


export {
	DataList
}