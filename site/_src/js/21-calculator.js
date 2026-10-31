function calcUpdate() {
  const team = parseFloat(document.getElementById('c-team').value) || 0
  const hours = parseFloat(document.getElementById('c-hours').value) || 0
  const rate = parseFloat(document.getElementById('c-rate').value) || 0
  const weeks = 52
  const totalHours = team * hours * weeks
  const adminCost = totalHours * rate
  const twinCost = 10500
  const recovered = totalHours
  const fmt = n => '£' + Math.round(n).toLocaleString('en-GB')
  const fmtH = n => Math.round(n).toLocaleString('en-GB') + ' hours'
  document.querySelector('[data-o="admin"]').textContent = fmt(adminCost)
  document.querySelector('[data-o="twinthos"]').textContent = fmt(twinCost)
  document.querySelector('[data-o="hours"]').textContent = fmtH(recovered)
}
document.addEventListener('DOMContentLoaded', () => {
  const ids = ['c-team','c-hours','c-rate']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.addEventListener('input', calcUpdate)
  })
  calcUpdate()
})
