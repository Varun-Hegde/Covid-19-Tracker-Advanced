import React from 'react';
import './Table.css';
import numeral from 'numeral';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

function Table({ countries }) {
	return (
		<div className="table">
			<SimpleBarReact style={{ maxHeight: 400 }}>
				{countries.map((country) => {
					return (
						<tr>
							<td>{country.country}</td>
							<td>
								<strong className="num">{numeral(country.cases).format('0,0')}</strong>
							</td>
						</tr>
					);
				})}
			</SimpleBarReact>
		</div>
	);
}

export default Table;
