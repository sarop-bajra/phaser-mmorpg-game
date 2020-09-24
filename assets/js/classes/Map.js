class Map {

  constructor(scene, key, tileSetName, bgLayerName, blockedLayerName) {
    this.scene = scene; // the scene thismap belongs to
    this.key = key; // Tiled JSON file key name
    this.tileSetName = tileSetName; // Tiled Tileset image key name
    this.bgLayerName = bgLayerName; // the name of the layer created in tiled for the map background
    this.blockedLayerName = blockedLayerName; // name of the layer created in Tiled for the blocked area
    this.createMap();

  } // constructor

  createMap() {
    // create the tile map using make.tilemap method, providing
    // an object with a key name 'this.key' which was loaded earlier
    // in the loadTileMap function in GameScene

    this.map = this.scene.make.tilemap({key: this.key})
    // add the tileset image to our map by using map.addTilesetImage methood
    // which takes 6 args: name of phaser layer, tileset image, frame width,
    // frame height, margin and spacing inside of image
    this.tiles = this.map.addTilesetImage(this.tileSetName, this.tileSetName, 32, 32, 1, 2);

    // create our background layer using
    // createStaticLayer method, which takes 4 arguments
    // name of layer, tiles that we loaded, x-pos, y-pos for starting point of layer
    this.backgroundLayer = this.map.createStaticLayer(this.bgLayerName, this.tiles, 0, 0);
    this.backgroundLayer.setScale(2);

    // create blocked layer
    this.blockedLayer = this.map.createStaticLayer(this.blockedLayerName, this.tiles, 0, 0);
    this.blockedLayer.setScale(2);
    // setCollisionByExclusion takes in an array to determine which tile should
    // be excluded. Usinf [-1] means that all tiles in the layer will be checked
    // for collisions
    this.blockedLayer.setCollisionByExclusion([-1]);

    // update the world bounds from canvas size to full map
    this.scene.physics.world.bounds.width = this.map.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.map.heightInPixels * 2;

    // limit the camera to the size of our map
    // removes inifinite space or the black area
    // args xpos, ypos, width map, height map
    this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);



  } // createMap

} // Map
