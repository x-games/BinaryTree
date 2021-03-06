var BinarySearchTree = {

    root: null,

    depth: 0,
    a: 0,
    b: 0,

    arr: [],
    arrVal: [],

    add: function(value) {
        var node = {
            value: value,
            left: null,
            right: null,
            color: null,
            level: null,
            x: null,
            y: null
        };

        this.arr.push(node);
        this.arrVal.push(node.value);

        var current;

        if (this.root === null) {
            this.root = node;
        } else {
            current = this.root;
            while(true) {
                if (value < current.value) {
                    if (current.left === null) {
                        current.left = node;
                        this.a++;
                        break;
                    } else {
                        current = current.left;
                    }
                } else if (value > current.value) {
                    if (current.right === null) {
                        current.right = node;
                        this.b++;
                        break;
                    } else {
                        current = current.right;
                    }
                } else {
                    break;
                }
            }
            this.depth = (Math.max(this.a, this.b));
        }
    },

    contains: function(value) {
        var found = false;
        var current = this.root;

        while(!found && current) {
            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                found = true;
            }
        }
        return found;
    },

    traverse: function(process) {
        function inOrder(node) {
            if (node) {
                if (node.left !== null) {
                    inOrder(node.left);
                }
                process.call(this, node);
                if (node.right !== null) {
                    inOrder(node.right);
                }
            }
        }
        inOrder(this.root);
    },

    size: function() {
        var length = 0;

        this.traverse(function(node) {
            length++;
        });

        return length;
    },

    toArray: function() {
        var result = [];

        this.traverse(function(node) {
            result.push(node.value);
        });

        return result;
    },

    toString: function() {
        return this.toArray().toString();
    },

    render: function() {
        this.elemDepth();
        this.levelsForArrays();
        var thisEl = this;
        this.arr.forEach(function(entry) {
            $('body').append('<div id="'+entry.value+'" class="lvl'+entry.level+'">' + entry.value + '</div>');
            var that = $('#'+entry.value);
            if(entry.left !== null && entry.right !== null) {
                that.attr('left',entry.left.value).attr('right',entry.right.value);
            } else if(entry.left !== null) {
                that.attr('left',entry.left.value);
            } else if(entry.right !== null) {
                that.attr('right',entry.right.value);
            }
        });
        function order() {
            $('div').each(function() {
                var id = $(this).attr('id');
                $(this).appendTo('div[left='+id+']').addClass('left');
                $(this).appendTo('div[right='+id+']').addClass('right');
            });
        }
        order();
    },

    BFS: function() {
        this.elemDepth();

        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var W = window.innerWidth;
        var H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        function bfs (root) {
            var q = [];
            q.push(root);
            while (q.length > 0) {
                var n = q.shift();

                ctx.beginPath();
                ctx.arc(n.x,n.y,5,0,2*Math.PI);
                ctx.fillStyle = 'black';
                ctx.fill();
                ctx.stroke();
                ctx.font = "14px Arial";
                ctx.fillText(n.value,n.x-4,n.y-10);

                if (n.left !== null) {
                    q.push(n.left);
                    ctx.moveTo(n.x,n.y);
                    ctx.lineTo(n.x-150/(n.left.level),n.y+50);
                    ctx.stroke();
                }
                if (n.right !== null) {
                    q.push(n.right);
                    ctx.moveTo(n.x,n.y);
                    ctx.lineTo(n.x+150/(n.right.level),n.y+50);
                    ctx.stroke();
                }
            }
        }
        bfs(this.root);
    },

    elemDepth: function() {
        function setLvl(node, i, x, y) {
            node.level = i++;
            node.x = x;
            node.y = y;
            if(node.left !== null) {
                setLvl(node.left, i, x-150/i, y+50);
            }
            if(node.right !== null) {
                setLvl(node.right, i, x+150/i, y+50);
            }
        }
        setLvl(this.root, 0, 600, 30);
    },

    levelsForArrays: function() {
        var levels = [];
        var tmp = [];
        for(var i = 0; i < this.arr.length; i++) {
            if(tmp[this.arr[i].level] !== null && Array.isArray(tmp[this.arr[i].level])) {
                tmp[this.arr[i].level].push(this.arr[i])
            } else {
                tmp[this.arr[i].level] = [];
                tmp[this.arr[i].level].push(this.arr[i])
            }
        }
        console.log(tmp);
    },

    level: function() {
        function lvl(node) {
            if (node) {
                if (node.left !== null) {
                    lvl(node.left);
                }
                if (node.right !== null) {
                    lvl(node.right);
                }
            }
        }
        lvl(this.root);
    },

    height: function() {
        function calc(node) {
            if(node === null) {
                return -1
            } else {
                return (Math.max(calc(node.left), calc(node.right)) + 1);
            }
        }
        console.log(calc(this.root));
        return(calc(this.root));
    },

    remove: function(value) {

        var found       = false,
            parent      = null,
            current     = this.root,
            childCount,
            replacement,
            replacementParent;

        while(!found && current) {

            if (value < current.value) {
                parent = current;
                current = current.left;
            } else if (value > current.value) {
                parent = current;
                current = current.right;
            } else {
                found = true;
            }
        }

        if (found) {

            childCount = (current.left !== null ? 1 : 0) + (current.right !== null ? 1 : 0);

            if (current === this.root) {
                switch(childCount) {
                    case 0:
                        this.root = null;
                        break;
                    case 1:
                        this.root = (current.right === null ? current.left : current.right);
                        break;
                    case 2:
                        replacement = this.root.left;

                        while (replacement.right !== null) {
                            replacementParent = replacement;
                            replacement = replacement.right;
                        }

                        if (replacementParent !== null) {

                            replacementParent.right = replacement.left;

                            replacement.right = this.root.right;
                            replacement.left = this.root.left;
                        } else {

                            replacement.right = this.root.right;
                        }

                        this.root = replacement;

                    //no default
                }
            } else {
                switch (childCount) {
                    case 0:
                        if (current.value < parent.value) {
                            parent.left = null;
                        } else {
                            parent.right = null;
                        }
                        break;
                    case 1:
                        if (current.value < parent.value) {
                            parent.left = (current.left === null ? current.right : current.left);
                        } else {
                            parent.right = (current.left === null ? current.right : current.left);
                        }
                        break;

                    case 2:

                        replacement = current.left;
                        replacementParent = current;

                        while(replacement.right !== null) {
                            replacementParent = replacement;
                            replacement = replacement.right;
                        }

                        replacementParent.right = replacement.left;

                        replacement.right = current.right;
                        replacement.left = current.left;

                        if (current.value < parent.value) {
                            parent.left = replacement;
                        } else {
                            parent.right = replacement;
                        }

                    //no default
                }
            }
        }
    },

    renderCanvas: function() {
        this.elemDepth();
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        //Lets resize the canvas to occupy the full page
        var W = window.innerWidth;
        var H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        this.arr.forEach(function(entry) {
            ctx.beginPath();
            ctx.arc(entry.x,entry.y,5,0,2*Math.PI);
            ctx.stroke();
        });
    }
};