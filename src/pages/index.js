import React from 'react'
import Layout from '../components/layout'
import myData from '../gifts.json'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

class IndexPage extends React.Component {
  render() {
    const people = Array.from(new Set(myData.Items.map(i => i.For)));
    
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
        accessor: 'Name',
      },
      {
        Header: 'For',
        accessor: 'For',
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true;
          }          
          return row[filter.id] === filter.value;
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'Dorota'}
          >
            { people.map(p => {return <option value={p}>{p}</option>}) }
            <option value="all">Show All</option>
          </select>
        )
      },
      {
        Header: 'Tracking number',
        accessor: 'Tracking',
        Cell: row => <a href={row.row.Tracking.Url} target='_blank' rel="noopener noreferrer">{row.row.Tracking.Number}</a>,
      },
      {
        id: 'arrived',
        Header: 'Arrived',
        accessor: item => (item.Arrived ? 'Yes' : 'No'),
        filterMethod: (filter, row) => {
          if (filter.value === 'all') {
            return true;
          }
          if (filter.value === 'true') {
            return row[filter.id] === 'Yes';
          }
          return row[filter.id] === 'No';
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: '100%' }}
            value={filter ? filter.value : 'all'}
          >
            {}
            <option value="all">Show All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        )
      }
    ]

    return (
      <Layout>
        <ReactTable
          data={myData.Items.sort((a, b) => a.Arrived === b.Arrived ? 0 : a.Arrived ? 1 : -1)}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]).toLocaleLowerCase().includes(filter.value.toLocaleLowerCase())}
          columns={columns}
          defaultPageSize={5}
          classsName="-striped -highlight"
        />
      </Layout>
    )
  }
}

export default IndexPage
