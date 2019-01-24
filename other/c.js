let count = 0;
function fn() {
  let num = prompt(`当前计数：${count}\n继续输入数字`, '');
  if (num === null || num === '') return;
  if (typeof num !== 'number') {
    num = Number(num)
  }
  if (num !== parseInt(num)) {
    alert('输入数字不为整数，请重新输入:');
    return fn();
  };
  count += num;
  return fn();
}
fn();