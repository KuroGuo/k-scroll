## K-scroll

### Quick Examples

<a href="http://kuroguo.github.io/k-scroll/example/" target="_blank">example</a>

```html
<link rel="stylesheet" type="text/css" href="bower_components/k-scroll/dist/k-scroll.css">
<div id="list1" class="my-list k-scroller-wrapper">
  <ul class="k-scroller">
    <script>
      for (var i = 0; i < 100; i++) {
        document.write('<li class="item">' + i + '</li>');
      }
    </script>
  </ul>
</div>

<script src="bower_components/k-tap/dist/k-tap.js"></script>
<script src="bower_components/k-drag/dist/k-drag.js"></script>
<script src="bower_components/velocity/velocity.min.js"></script>
<script src="bower_components/k-scroll/dist/k-scroll.js"></script>
<script>
  var list1 = document.querySelector('#list1');
  var list2 = document.querySelector('#list2');

  kScroll.bind(list1);
  kScroll.bind(list2);

  list1.addEventListener('k.tap', add);
  list2.addEventListener('k.tap', add);

  function add(e) {
    if (e.target.classList.contains('item')) {
      e.target.innerHTML = parseFloat(e.target.innerHTML) + 1;
    }
  }
</script>
```