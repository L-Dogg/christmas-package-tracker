import React from 'react'
import Layout from '../components/layout'

import ReactTable from 'react-table'
import 'react-table/react-table.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactLoading from 'react-loading'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
    }
    this.changeProductArrived = this.changeProductArrived.bind(this)

    this.apiBaseUrl = 'http://localhost:57227/'
  }

  componentDidMount() {
    this.getItems()
  }

  render() {
    const items = this.state.items

    if (items.length === 0) {
      return (
        <Layout>
          <center>
            <ReactLoading
              type={'spin'}
              color={'rebeccapurple'}
              height={'25%'}
              width={'25%'}
            />
          </center>
        </Layout>
      )
    }

    const people = Array.from(new Set(items.map(i => i.For)))
    const columns = [
      {
        Header: 'No',
        id: 'row',
        maxWidth: 50,
        filterable: false,
        Cell: row => {
          return <div>{row.index + 1}</div>
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'For',
        accessor: 'for',
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          return row[filter.id] === filter.value
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            {people.map((p, i) => {
              return (
                <option key={i} value={p}>
                  {p}
                </option>
              )
            })}
            <option value="all">Show All</option>
          </select>
        ),
      },
      {
        Header: 'Tracking number',
        accessor: 'tracking',
        Cell: row => (
          <a
            href={row.row.tracking.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.row.tracking.number}
          </a>
        ),
      },
      {
        id: 'arrived',
        Header: 'Arrived',
        accessor: item => (item.arrived ? 'Yes' : 'No'),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true
          }
          if (filter.value === 'true') {
            return row[filter.id] === 'Yes'
          }
          return row[filter.id] === 'No'
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            <option value="all">Show All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ),
        Cell: props => (
          <button
            className={
              props.value === 'Yes'
                ? 'btn btn-primary'
                : 'btn btn-outline-primary'
            }
            onClick={() => this.changeProductArrived(props.original)}
          >
            {props.value}
          </button>
        ),
      },
    ]

    return (
      <Layout>
        <ReactTable
          data={items.sort((a, b) =>
            a.arrived === b.arrived ? 0 : a.arrived ? 1 : -1
          )}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id])
              .toLocaleLowerCase()
              .includes(filter.value.toLocaleLowerCase())
          }
          columns={columns}
          defaultPageSize={10}
          classsName="-striped -highlight"
          getTdProps={() => ({
            style: {
              textAlign: 'center',
            },
          })}
          getTheadFilterThProps={() => ({
            className: 'form-control',
          })}
        />
      </Layout>
    )
  }

  changeProductArrived(item) {
    let itemToChange = this.state.items.find(i => i.name === item.name)
    if (itemToChange === undefined) return

    fetch(
      `${this.apiBaseUrl}api/packagetracking/setarrived?itemName=${item.name}&arrived=${!item.arrived}`,
      {
        method: 'PATCH',
      }
    )
      .then(() => {
        itemToChange.arrived = !item.arrived
        this.forceUpdate()
      })
      .catch(error => console.log(error))
  }

  getItems() {
    fetch(`${this.apiBaseUrl}api/packagetracking`)
      .then(response => response.json())
      .then(data => {
        this.setState({ items: data.items })
      })
      .catch(error => console.log(error))
  }
}

export default IndexPage
