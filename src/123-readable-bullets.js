'use strict';
// harmless illusion shots: a solid hollow ring, fully opaque, with a dark edge
drawFakes=function(){for(const q of fakes){const X=sx(q.x,q.y),Y=sy(q.x,q.y)-7,r=Math.max(3,Math.round(q.r||3))+1;
  circ(X,Y,r+1,'#0a0610');circ(X,Y,r,q.col);circ(X,Y,r-1,q.col);circ(X,Y,r-2,'#0a0610');}};
