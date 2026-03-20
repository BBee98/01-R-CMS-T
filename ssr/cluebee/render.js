const _updateSummary = require('./updateSummary');

const _icon = (status) => {
    return status === 'pass' ? '✔' : status === 'fail' ? '✘' : '○';
}

const _list = () => {
    const list = document.getElementById('test-list');
    list.innerHTML = Object.entries(this._data).map(([component, tests]) => `
                <div class="component-block">
                    <div class="component-name">${component}</div>
                    <table>
                        <thead>
                            <tr>
                                <th class="td-status"></th>
                                <th class="td-name">Test</th>
                                <th class="td-badge">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tests.map(t => `
                            <tr>
                                <td class="td-status"><span class="icon ${t.status}">${this._icon(t.status)}</span></td>
                                <td class="td-name" title="${t.name}">${t.name}</td>
                                <td class="td-badge"><span class="badge ${t.status}">${t.status}</span></td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('');
}

function _render() {
    _updateSummary();
    _list()

}

module.exports = _render;