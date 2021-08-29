
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
					total : total
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
								height={height-this.props.reduceHeight}
								rowHeight={this.cache.rowHeight}
								deferredMeasurementCache={this.cache}
								rowCount={count}
								className={`wx-data-list list-inner` + this.props.className}
								rowRenderer={({ key, index, style, parent }) => {
									const record = store.getAt(index);
									return (
										<CellMeasurer
											key={record.get(this.props.propertyId)}
											cache={this.cache}
											parent={parent}
											columnIndex={0}
											rowIndex={index}
										>
											<div className="wrapper-item" style={style}>
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