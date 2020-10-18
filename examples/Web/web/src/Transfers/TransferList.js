import React, { Component } from 'react';

import {
    Checkbox
} from 'semantic-ui-react';

import { formatBytes, getFileName } from '../util';

import { 
    Header, 
    Table, 
    Icon, 
    List, 
    Progress,
    Button
} from 'semantic-ui-react';

const getColor = (state) => {
    switch(state) {
        case 'InProgress':
            return { color: 'blue' }; 
        case 'Completed, Succeeded':
            return { color: 'green' };
        case 'Requested':
        case 'Queued':
            return '';
        case 'Initializing':
            return { color: 'teal' };
        default:
            return { color: 'red' };
    }
}

class TransferList extends Component {
    render = () => {
        const { directoryName, onSelectionChange, files, onPlaceInQueueRequested } = this.props;

        return (
            <div>
                <Header 
                    size='small' 
                    className='filelist-header'
                >
                    <Icon name='folder'/>{directoryName}
                </Header>
                <List>
                    <List.Item>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell className='transferlist-selector'>
                                    <Checkbox 
                                        fitted 
                                        checked={files.filter(f => !f.selected).length === 0}
                                        onChange={(event, data) => files.map(file => onSelectionChange(directoryName, file, data.checked))}
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell className='transferlist-filename'>File</Table.HeaderCell>
                                <Table.HeaderCell className='transferlist-progress'>Progress</Table.HeaderCell>
                                <Table.HeaderCell className='transferlist-size'>Size</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {files.sort((a, b) => getFileName(a.filename).localeCompare(getFileName(b.filename))).map((f, i) => 
                                <Table.Row key={i}>
                                    <Table.Cell className='transferlist-selector'>
                                        <Checkbox 
                                            fitted 
                                            checked={f.selected}
                                            onChange={(event, data) => onSelectionChange(directoryName, f, data.checked)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell className='transferlist-filename'>{getFileName(f.filename)}</Table.Cell>
                                    <Table.Cell className='transferlist-progress'>
                                        {f.state === 'InProgress' ? 
                                        <Progress 
                                            style={{ margin: 0 }}
                                            percent={Math.round(f.percentComplete)} 
                                            progress color={getColor(f.state).color}
                                        /> : 
                                        <Button 
                                            fluid 
                                            size='mini' 
                                            style={{ margin: 0, padding: 7 }} 
                                            {...getColor(f.state)} 
                                            onClick={() => onPlaceInQueueRequested(f)}
                                        >
                                            {f.state}{f.placeInQueue ? ` (#${f.placeInQueue})` : ''}
                                        </Button>}
                                    </Table.Cell>
                                    <Table.Cell className='transferlist-size'>
                                        {f.bytesTransferred > 0 ? formatBytes(f.bytesTransferred).split(' ', 1) + '/' + formatBytes(f.size) : ''}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                    </List.Item>
                </List>
            </div>
        )
    }
};

export default TransferList;
