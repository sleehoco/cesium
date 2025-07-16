
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Car, Shield, Zap, Award } from 'lucide-react';

interface CEOPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CEOPopup = ({ open, onOpenChange }: CEOPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary mb-4">
            Meet Our CEO & Her McLaren
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="/lovable-uploads/cee34249-f281-4794-95ee-30901f0105a9.png"
                alt="CEO with McLaren in garage"
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Car className="h-3 w-3" />
                McLaren 720S
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Performance
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Security First
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Leadership & Innovation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our CEO embodies the perfect blend of cutting-edge technology and high-performance 
                excellence. Just like her McLaren 720S, she believes in pushing boundaries and 
                delivering uncompromising performance in cybersecurity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Why the McLaren?
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Precision engineering mirrors our approach to cybersecurity</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Speed and agility in threat response and innovation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Uncompromising standards in both design and security</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Leading the race in technological advancement</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-foreground">
                The Cesium Connection
              </h4>
              <p className="text-sm text-muted-foreground">
                Notice the Cesium Cybersecurity branding on the McLaren? That's not just marketing – 
                it represents our commitment to being the fastest, most reliable cybersecurity 
                partner you can trust. We don't just protect your data, we accelerate your business.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground italic">
                "In cybersecurity, like in racing, there's no second place when it comes to performance." 
                - CEO, Julia Morrison
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CEOPopup;
