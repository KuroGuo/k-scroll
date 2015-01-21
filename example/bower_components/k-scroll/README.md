## K-scroll

High performance scroll component.

### Install

```bash
$ bower install k-scroll
```

### Quick Example

<a href="http://kuroguo.github.io/k-scroll/example/" target="_blank">example</a>

```html
<link rel="stylesheet" href="bower_components/k-scroll/dist/k-scroll.css">
<div id="list" class="k-scroller-wrapper">
  <ul class="k-scroller">
    <script>
      for (var i = 0; i < 100; i++) {
        document.write('<li class="item">' + i + '</li>');
      }
    </script>
  </ul>
</div>

<script src="bower_components/k-drag/dist/k-drag.js"></script>
<script src="bower_components/velocity/velocity.min.js"></script>
<script src="bower_components/k-scroll/dist/k-scroll.js"></script>
<script>
  var list = document.querySelector('#list');

  kScroll.bind(list);
</script>
```
