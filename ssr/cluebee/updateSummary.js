function _updateSummary() {
    const all = Object.values(this._data).flat();
    if (!all.length) return;
    const failed = all.some(t => t.status === 'fail');
    const badge = document.getElementById('summary-badge');
    badge.textContent = failed ? 'FAIL' : 'PASS';
    badge.className = failed ? 'fail' : 'pass';
    badge.style.display = 'inline-block';
}

module.exports = _updateSummary;