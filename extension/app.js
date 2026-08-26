const sample = "10.0.0.0/16";

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const statsEl = document.getElementById('output-stats') || document.getElementById('stats');

function process() {
  const txt = inputEl.value;
  if (!txt.trim()) { outputEl.value = ''; if (statsEl) statsEl.textContent = ''; return; }
  const res = IPSubnet.calculate(txt);
  outputEl.value = JSON.stringify(res, null, 2);
  if (statsEl) statsEl.textContent = res.error || `Network: ${res.networkAddress}/${res.prefix} (${res.usableHosts} usable hosts)`;
}

document.getElementById('btn-run').addEventListener('click', process);
inputEl.addEventListener('input', process);
document.getElementById('btn-sample').addEventListener('click', () => { inputEl.value = sample; process(); });
document.getElementById('btn-copy').addEventListener('click', () => { navigator.clipboard.writeText(outputEl.value); alert('Copied subnet calculation!'); });
if (document.getElementById('btn-clear')) document.getElementById('btn-clear').addEventListener('click', () => { inputEl.value = ''; outputEl.value = ''; });
process();
