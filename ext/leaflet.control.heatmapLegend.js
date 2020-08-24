L.Control.HeatmapLegendControl = L.Control.extend({
    options: {
        position: 'bottomleft' // Choices are: topright, topleft, bottomright or bottomleft        
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._extremeData = {min: undefined, max: undefined, gradient: {}};

    },

    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
       //We need a redraw even if values didn't change, hence this little trick...
        var data = this._extremeData; 
        this._extremeData={min: undefined, max: undefined, gradient: {}};
        this.updateLegend(data);
        return this;
    },

    onAdd: function (map) {

        // Create a control heatmapContainer with an img for the legend and min/max values
        // You can tweak styles using heatmap.control.legend.css
        this._heatmapLegendContainer = L.DomUtil.create('div', 'heatmapLegend', this._container);
        this._legendCanvas = document.createElement('canvas');
        this._legendCanvas.width = 100;
        this._legendCanvas.height = 10;
        var legend = L.DomUtil.create('div','heatmapLegendImg', this._heatmapLegendContainer);
        legend.innerHTML = "<span id='heatmapLegendMin'></span><span id='heatmapLegendMax'></span><img src='' id='heatmapLegendGradient'>";
        
        return this._heatmapLegendContainer;
    },

    onRemove: function (map) { 
	
    },

    updateLegend: function (data) { // Called each time heatmap's extremas change

    if ( this._legendCanvas && (data != this._extremeData)) {
      this._extremeData = data;
      //We could create the img once in 'onAdd' but someone may change the gradient config...
      var legendCtx = this._legendCanvas.getContext('2d');  
      var gradient = legendCtx.createLinearGradient(0, 0, 100, 1);
      var gradientImg = document.querySelector('#heatmapLegendGradient');
      //Update min and max values
      var min = document.querySelector('#heatmapLegendMin');
      var max = document.querySelector('#heatmapLegendMax');

      min.innerHTML = data.min;
      max.innerHTML = data.max;
          
      for (var key in data.gradient) {
        gradient.addColorStop(key, data.gradient[key]);
      }

      legendCtx.fillStyle = gradient;
      legendCtx.fillRect(0, 0, 100, 10); 

      gradientImg.src = this._legendCanvas.toDataURL();
    }
  }
});

L.control.heatmapLegend = function (options) {
    return new L.Control.HeatmapLegendControl(options);
};
